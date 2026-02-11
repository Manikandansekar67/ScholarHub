import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { scholarshipAPI, applicationAPI, documentAPI } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on package.json

interface ApplicationFormValues {
    coverLetter?: string;
    [key: string]: any;
}

const ScholarshipApplication = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
    const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormValues>();

    // Fetch scholarship details
    const { data: scholarshipResponse, isLoading: isLoadingScholarship } = useQuery({
        queryKey: ["scholarship", id],
        queryFn: () => scholarshipAPI.getById(id!),
        enabled: !!id,
    });

    const scholarship = scholarshipResponse?.data;

    // Submit application mutation
    const submitMutation = useMutation({
        mutationFn: (data: any) => applicationAPI.submit(data),
        onSuccess: () => {
            toast.success("Application submitted successfully!");
            navigate("/dashboard");
        },
        onError: (error: any) => {
            setGeneralError(error.message || "Failed to submit application");
            toast.error("Failed to submit application");
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, requirementIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const key = `doc_${requirementIndex}`;
        setUploadingFiles(prev => ({ ...prev, [key]: true }));

        try {
            const response = await documentAPI.upload(file);
            const document = response.data; // Assuming response.data is the document object

            setUploadedDocuments(prev => ({
                ...prev,
                [key]: {
                    id: document._id || document.id,
                    name: document.originalName || file.name,
                    url: document.url
                }
            }));
            toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error(`Failed to upload ${file.name}`);
        } finally {
            setUploadingFiles(prev => ({ ...prev, [key]: false }));
        }
    };

    const removeDocument = (requirementIndex: number) => {
        const key = `doc_${requirementIndex}`;
        const newDocs = { ...uploadedDocuments };
        delete newDocs[key];
        setUploadedDocuments(newDocs);
    };

    const onSubmit = (data: ApplicationFormValues) => {
        if (!scholarship || !id) return;

        // Check if required documents are uploaded
        const requiredDocs = scholarship.requirements?.documents || [];
        const missingDocs = requiredDocs.some((_: string, index: number) => !uploadedDocuments[`doc_${index}`]);

        if (missingDocs) {
            setGeneralError("Please upload all required documents before submitting.");
            return;
        }

        // Prepare arrays for submission
        // Based on backend model, Application likely expects 'answers' (array of objects) or 'documents' (array of refs)
        // Looking at common patterns, let's assume it wants an array of objects with question/answer or similar,
        // plus the documents.
        // However, without seeing Application model, I'll structure it as expected by a typical submission endpoint.
        // If the endpoint simply takes { scholarshipId, documents: [ids], ... }

        // Construct payload
        // Mapping uploaded documents to expected format
        const documentsPayload = Object.values(uploadedDocuments).map(doc => doc.id);

        const payload = {
            scholarship: id,
            scholarshipId: id, // Redundant but safe
            coverLetter: data.coverLetter,
            // If backend expects specific structure for documents, adjust here.
            // Assuming simple array of document IDs or objects
            documents: documentsPayload,
            answers: [] // If there were questions
        };

        submitMutation.mutate(payload);
    };

    if (isLoadingScholarship) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">Scholarship Not Found</h2>
                    <Button asChild>
                        <Link to="/scholarships">Back to Scholarships</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    const requiredDocuments = scholarship.requirements?.documents || [];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-8">
                <div className="container max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Apply for {scholarship.title}
                        </h1>
                        <p className="text-muted-foreground">
                            Please complete the form below and upload all required documents.
                        </p>
                    </div>

                    {generalError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{generalError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Contact Info Confirmation */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Your profile information will be automatically included with your application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Read-only fields if we had user context here easily, 
                      but user knows they are logged in. 
                      Maybe adding a Cover Letter field? */}
                                    <div className="md:col-span-2">
                                        <Label htmlFor="coverLetter">Cover Letter / Personal Statement</Label>
                                        <Textarea
                                            id="coverLetter"
                                            placeholder="Why are you a good candidate for this scholarship?"
                                            className="mt-2 min-h-[150px]"
                                            {...register("coverLetter", { required: "Cover letter is required" })}
                                        />
                                        {errors.coverLetter && (
                                            <p className="text-sm text-destructive mt-1">{errors.coverLetter.message as string}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Uploads */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Required Documents</CardTitle>
                                <CardDescription>
                                    Please upload the following documents in PDF, JPG, or PNG format.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {requiredDocuments.length === 0 ? (
                                    <p className="text-muted-foreground text-sm italic">No specific documents required for this application.</p>
                                ) : (
                                    requiredDocuments.map((docName: string, index: number) => {
                                        const isUploaded = !!uploadedDocuments[`doc_${index}`];
                                        const isUploading = uploadingFiles[`doc_${index}`];

                                        return (
                                            <div key={index} className="border border-border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Label className="text-base font-medium">
                                                        {docName} <span className="text-destructive">*</span>
                                                    </Label>
                                                    {isUploaded && (
                                                        <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-0">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Uploaded
                                                        </Badge>
                                                    )}
                                                </div>

                                                {isUploaded ? (
                                                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText className="h-4 w-4 text-primary shrink-0" />
                                                            <span className="text-sm truncate max-w-[200px] md:max-w-xs">
                                                                {uploadedDocuments[`doc_${index}`].name}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeDocument(index)}
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id={`file-${index}`}
                                                            className="hidden"
                                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                            onChange={(e) => handleFileUpload(e, index)}
                                                            disabled={isUploading}
                                                        />
                                                        <Label
                                                            htmlFor={`file-${index}`}
                                                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : "border-muted-foreground/25"
                                                                }`}
                                                        >
                                                            {isUploading ? (
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                                    <span className="text-sm text-muted-foreground">Uploading...</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                                                    <span className="text-sm font-medium text-muted-foreground">
                                                                        Click to upload or drag and drop
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground/70">
                                                                        PDF, Word, or Images (max 5MB)
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Label>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4 pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={submitMutation.isPending}
                                className="w-full sm:w-auto self-end"
                            >
                                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ScholarshipApplication;
