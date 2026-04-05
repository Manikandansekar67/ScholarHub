import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { scholarshipAPI } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

const ManageScholarships = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: scholarshipsResponse,
        isLoading
    } = useQuery({
        queryKey: ["mySponsoredScholarships"],
        queryFn: () => scholarshipAPI.getMySponsoredScholarships()
    });

    const scholarships = scholarshipsResponse?.data || [];

    const deleteMutation = useMutation({
        mutationFn: (id) => scholarshipAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["mySponsoredScholarships"]);
            toast.success("Scholarship deleted successfully");
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete scholarship");
        }
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this scholarship?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />

            <main className="flex-1 py-8">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                Manage Scholarships
                            </h1>
                            <p className="text-muted-foreground">
                                View, create, edit, and delete your scholarships
                            </p>
                        </div>
                        <Button asChild className="gap-2">
                            <Link to="/manage-scholarships/new">
                                <Plus className="h-4 w-4" />
                                Create New Scholarship
                            </Link>
                        </Button>
                    </div>

                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle>Your Scholarships</CardTitle>
                            <CardDescription>A list of all the scholarships you have created</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : scholarships.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No scholarships found. <Link to="/manage-scholarships/new" className="text-primary hover:underline">Create one</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {scholarships.map((scholarship) => (
                                        <div key={scholarship._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-foreground truncate">
                                                    {scholarship.title}
                                                </h4>
                                                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                                    <span>Amount: ${scholarship.amount}</span>
                                                    <span>Category: {scholarship.category}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="border gap-1">
                                                    {scholarship.status}
                                                </Badge>
                                                <Button variant="outline" size="sm" onClick={() => navigate(`/manage-scholarships/${scholarship._id}/edit`)}>
                                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(scholarship._id)}>
                                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ManageScholarships;
