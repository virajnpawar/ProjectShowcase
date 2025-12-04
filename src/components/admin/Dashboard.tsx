import React, { useEffect, useState } from 'react';
import { pb, isAdmin } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin()) {
            window.location.href = '/admin/login';
            return;
        }

        const fetchProjects = async () => {
            try {
                const records = await pb.collection('projects').getFullList({
                    sort: '-created',
                });
                setProjects(records);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleLogout = () => {
        pb.authStore.clear();
        window.location.href = '/admin/login';
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <Button onClick={handleLogout} variant="outline">Logout</Button>
                    <Button onClick={() => window.location.href = '/admin/editor/new'}>
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects.length}</div>
                    </CardContent>
                </Card>
                {/* Add more stats here */}
            </div>

            <div className="rounded-md border">
                <div className="p-4">
                    <h3 className="mb-4 text-lg font-medium">Recent Projects</h3>
                    {projects.length === 0 ? (
                        <p className="text-muted-foreground">No projects found.</p>
                    ) : (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{project.title}</p>
                                        <p className="text-sm text-muted-foreground">{project.status}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/editor/${project.id}`}>Edit</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
