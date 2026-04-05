import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scholarshipAPI } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const categories = ['STEM', 'Arts', 'Leadership', 'Need-Based', 'Business', 'Healthcare', 'Other'];

const ScholarshipForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: scholarshipData, isLoading: isLoadingData } = useQuery({
        queryKey: ["scholarship", id],
        queryFn: () => scholarshipAPI.getById(id),
        enabled: isEditMode
    });

    const scholarship = scholarshipData?.data;

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            amount: "",
            deadline: "",
            eligibility: "",
            category: "",
            minGPA: "",
            academicLevel: "",
            documents: ""
        }
    });

    useEffect(() => {
        if (isEditMode && scholarship) {
            setValue("title", scholarship.title);
            setValue("description", scholarship.description);
            setValue("amount", scholarship.amount);
            setValue("deadline", new Date(scholarship.deadline).toISOString().split('T')[0]);
            setValue("eligibility", scholarship.eligibility?.join(", "));
            setValue("category", scholarship.category);
            setValue("minGPA", scholarship.requirements?.minGPA || "");
            setValue("academicLevel", scholarship.requirements?.academicLevel?.join(", ") || "");
            setValue("documents", scholarship.requirements?.documents?.join(", ") || "");
        }
    }, [isEditMode, scholarship, setValue]);

    const mutation = useMutation({
        mutationFn: (data) => isEditMode ? scholarshipAPI.update(id, data) : scholarshipAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["mySponsoredScholarships"]);
            queryClient.invalidateQueries(["scholarships"]);
            toast.success(`Scholarship ${isEditMode ? 'updated' : 'created'} successfully!`);
            navigate("/manage-scholarships");
        },
        onError: (err) => {
            toast.error(err.message || "Failed to save scholarship");
        }
    });

    const onSubmit = (data) => {
        const payload = {
            title: data.title,
            description: data.description,
            amount: Number(data.amount),
            deadline: data.deadline,
            eligibility: data.eligibility.split(",").map(i => i.trim()).filter(Boolean),
            category: data.category,
            requirements: {
                minGPA: data.minGPA ? parseFloat(data.minGPA) : undefined,
                academicLevel: data.academicLevel.split(",").map(i => i.trim()).filter(Boolean),
                documents: data.documents.split(",").map(i => i.trim()).filter(Boolean),
            }
        };

        mutation.mutate(payload);
    };

    if (isEditMode && isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />

            <main className="flex-1 py-8">
                <div className="container max-w-2xl">
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle>{isEditMode ? "Edit Scholarship" : "Create New Scholarship"}</CardTitle>
                            <CardDescription>Fill out the details below to manage the scholarship</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" {...register("title", { required: "Title is required" })} />
                                    {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" {...register("description", { required: "Description is required" })} />
                                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount ($)</Label>
                                        <Input id="amount" type="number" {...register("amount", { required: "Amount is required", min: { value: 0, message: "Must be non-negative" } })} />
                                        {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deadline">Deadline</Label>
                                        <Input id="deadline" type="date" {...register("deadline", { required: "Deadline is required" })} />
                                        {errors.deadline && <p className="text-xs text-destructive">{errors.deadline.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("category", { required: "Category is required" })}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eligibility">Eligibility (Comma separated)</Label>
                                    <Input id="eligibility" placeholder="e.g. US Citizen, Engineering Major" {...register("eligibility", { required: "Eligibility is required" })} />
                                    {errors.eligibility && <p className="text-xs text-destructive">{errors.eligibility.message}</p>}
                                </div>

                                <div className="pt-4 border-t border-border mt-6">
                                    <h3 className="font-semibold mb-4 text-sm text-muted-foreground">Requirements (Optional)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="minGPA">Minimum GPA</Label>
                                            <Input id="minGPA" type="number" step="0.1" placeholder="e.g. 3.0" {...register("minGPA")} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="academicLevel">Academic Level (Comma separated)</Label>
                                            <Input id="academicLevel" placeholder="e.g. Undergraduate, Graduate" {...register("academicLevel")} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="documents">Required Documents (Comma separated)</Label>
                                            <Input id="documents" placeholder="e.g. Resume, Transcript, Letter of Recommendation" {...register("documents")} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-2 text-right">
                                    <Button variant="outline" type="button" onClick={() => navigate("/manage-scholarships")} disabled={mutation.isPending}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={mutation.isPending}>
                                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ScholarshipForm;
