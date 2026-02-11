import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { useState } from "react";

interface ProfileFormValues {
    fullName: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
}

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsUpdating(true);
        try {
            // Filter out empty passwords
            const updateData: any = { fullName: data.fullName, email: data.email };
            if (data.newPassword) {
                updateData.password = data.newPassword;
                // typically we might want current password for verification but let's keep it simple
            }

            const response = await authAPI.updateProfile(updateData) as any;
            // Verify if response.data.user exists or just response.user depending on API
            const updatedUser = response.user || response.data?.user || response;

            updateUser(updatedUser);
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error("Update failed", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) return null; // Should be protected route

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-8 container max-w-2xl">
                <div className="mb-8 flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-2xl">{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">{user.fullName}</h1>
                        <p className="text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Update your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    {...register("fullName", { required: "Name is required" })}
                                />
                                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                            </div>

                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium mb-4">Change Password (Optional)</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            {...register("newPassword", { minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                                        />
                                        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
