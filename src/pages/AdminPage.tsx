import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, Calendar, User, Heart, Search, Filter,
  Download, Mail, Phone, ExternalLink, ArrowUpDown,
  ChevronRight, ChevronLeft, MoreHorizontal, Briefcase, FileText,
  Trash2
} from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Candidate } from '@shared/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
export function AdminPage() {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => api<{ items: Candidate[]; next: string | null }>('/api/candidates'),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/api/candidates/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success("Application deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete application");
    }
  });
  const filteredCandidates = useMemo(() => {
    if (!data?.items) return [];
    let items = [...data.items];
    // Search
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(c => 
        c.name.toLowerCase().includes(s) || 
        c.email.toLowerCase().includes(s) || 
        c.instagram.toLowerCase().includes(s) ||
        c.motivation.toLowerCase().includes(s)
      );
    }
    // Sort
    items.sort((a, b) => {
      return sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
    });
    return items;
  }, [data, search, sortOrder]);
  const downloadCSV = () => {
    if (!data?.items) return;
    const headers = ["ID", "Name", "Email", "Phone", "Instagram", "LinkedIn", "Experience", "Motivation", "Date Idea", "Created At"];
    const rows = data.items.map(c => [
      c.id, c.name, c.email, c.phone, c.instagram, c.linkedIn, c.experienceLevel,
      `"${c.motivation.replace(/"/g, '""')}"`, `"${c.dateIdea.replace(/"/g, '""')}"`,
      new Date(c.createdAt).toISOString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vidushan_quest_2025_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Dashboard Unavailable</h2>
        <p className="text-muted-foreground mt-2">{(error as Error).message}</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster richColors />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50/50">Quest 2025</Badge>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Administrative Control</span>
            </div>
            <h1 className="text-4xl font-display font-bold">Candidate Review</h1>
            <p className="text-muted-foreground mt-1">Manage and review {filteredCandidates.length} applications for Vidushan.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-10 w-full md:w-[260px] bg-secondary border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')} className="gap-2">
              <ArrowUpDown className="w-4 h-4" /> {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </Button>
            <Button variant="default" onClick={downloadCSV} className="bg-rose-600 hover:bg-rose-700 gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </header>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50">
                <CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" /></CardHeader>
                <CardContent className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-4 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-32 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-medium">No results found</h3>
            <p className="text-muted-foreground">Adjust your filters or keep marketing the quest!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredCandidates.map((candidate, index) => (
                <motion.div 
                  key={candidate.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-rose-50/50 dark:border-slate-800 hover:border-rose-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-bold">{candidate.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a href={`https://instagram.com/${candidate.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-rose-600 flex items-center gap-1 text-xs font-semibold hover:underline bg-rose-50 px-2 py-0.5 rounded">
                              <Instagram className="w-3 h-3" /> {candidate.instagram}
                            </a>
                            {candidate.linkedIn && (
                              <a href={candidate.linkedIn} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center gap-1 text-xs font-semibold hover:underline bg-blue-50 px-2 py-0.5 rounded">
                                <ExternalLink className="w-3 h-3" /> LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.open(`mailto:${candidate.email}`)}>Email Candidate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(candidate.resumeUrl, '_blank')} disabled={!candidate.resumeUrl}>View Portfolio</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                              onClick={() => handleDelete(candidate.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-5 pt-0">
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {candidate.email}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {candidate.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                          <User className="w-3 h-3" /> Why Me?
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-4 italic bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          "{candidate.motivation}"
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Level</h4>
                          <Badge variant="secondary" className="text-[10px] uppercase">{candidate.experienceLevel}</Badge>
                        </div>
                        {candidate.resumeUrl && (
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Portfolio</h4>
                            <a href={candidate.resumeUrl} target="_blank" className="flex items-center gap-1 text-[10px] text-rose-500 font-bold hover:underline">
                              <FileText className="w-3 h-3" /> View link
                            </a>
                          </div>
                        )}
                      </div>
                      <Separator className="bg-rose-50/50" />
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Heart className="w-3 h-3" /> Date Idea
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">{candidate.dateIdea}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                        <Calendar className="w-3 h-3" />
                        {new Date(candidate.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      <Badge variant="outline" className="text-[9px] bg-white dark:bg-slate-800">
                        ID: {candidate.id.split('-')[0]}
                      </Badge>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="mt-12 flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">Showing {filteredCandidates.length} of {data?.items?.length ?? 0} total applications</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="gap-1"><ChevronLeft className="w-4 h-4" /> Previous</Button>
            <Button variant="outline" size="sm" disabled={!data?.next} className="gap-1">Next <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}