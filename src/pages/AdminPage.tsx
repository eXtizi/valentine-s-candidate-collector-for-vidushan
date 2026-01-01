import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, Calendar, User, Heart, Search, Filter,
  Download, Mail, Phone, ExternalLink, ArrowUpDown,
  ChevronRight, ChevronLeft, MoreHorizontal, Briefcase, FileText,
  Trash2, RefreshCw, Lock, Sparkles
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
const FETCH_LIMIT = 50;
const AUTH_KEY = 'quest_auth_token_2025';
const SECRET_PASSWORD = 'damn123';
export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    const token = sessionStorage.getItem(AUTH_KEY);
    if (token === 'granted') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['candidates', cursor, FETCH_LIMIT],
    queryFn: () => api<{ items: Candidate[]; next: string | null }>(`/api/candidates?limit=${FETCH_LIMIT}${cursor ? `&cursor=${cursor}` : ''}`),
    enabled: isAuthenticated,
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
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.instagram.toLowerCase().includes(s) ||
        c.motivation.toLowerCase().includes(s)
      );
    }
    items.sort((a, b) => {
      return sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
    });
    return items;
  }, [data, search, sortOrder]);
  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === SECRET_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'granted');
      setIsAuthenticated(true);
      toast.success("Welcome back, Vidushan.");
    } else {
      toast.error("Unauthorized access attempt. Please try again.");
      setPassword('');
    }
  };
  const handleNextPage = () => {
    if (data?.next) {
      setCursorHistory(prev => [...prev, cursor]);
      setCursor(data.next);
    }
  };
  const handlePrevPage = () => {
    if (cursorHistory.length > 0) {
      const prevCursors = [...cursorHistory];
      const lastCursor = prevCursors.pop();
      setCursorHistory(prevCursors);
      setCursor(lastCursor ?? null);
    }
  };
  const downloadCSV = () => {
    if (!data?.items) return;
    const headers = ["ID", "Name", "Email", "Phone", "Instagram", "LinkedIn", "Experience", "Motivation", "Date Idea", "Availability", "Created At"];
    const rows = data.items.map(c => [
      c.id,
      c.name.replace(/,/g, ''),
      c.email,
      c.phone || '',
      c.instagram,
      c.linkedIn || '',
      c.experienceLevel,
      `"${c.motivation.replace(/"/g, '""')}"`,
      `"${c.dateIdea.replace(/"/g, '""')}"`,
      `"${c.availability.replace(/"/g, '""')}"`,
      new Date(c.createdAt).toISOString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vidushan_quest_2025_page_${cursorHistory.length + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Exported current page to CSV");
  };
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };
  if (isChecking) return null;
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl">
        <Toaster richColors position="top-center" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md p-8"
        >
          <Card className="border-rose-100 shadow-2xl shadow-rose-200/50 rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-500 to-amber-500" />
            <CardHeader className="text-center pt-10">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                <Lock className="w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-display font-bold">Admin Portal</CardTitle>
              <p className="text-muted-foreground mt-2">Only Vidushan can see who's in the running.</p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter Secret Key"
                    className="h-14 rounded-2xl text-center text-xl tracking-[0.5em] font-mono bg-secondary border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-rose-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Unlock Quest Records
                </Button>
              </form>
            </CardContent>
            <CardFooter className="pb-8 justify-center">
              <div className="flex items-center gap-2 text-rose-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Authorized Eyes Only</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Dashboard Unavailable</h2>
        <p className="text-muted-foreground mt-2">{(error as Error).message}</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-4 gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <Toaster richColors position="top-right" />
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50/50">Quest 2025</Badge>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Admin Dashboard</span>
            </div>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              Candidate Review
              {isFetching && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw className="w-5 h-5 text-rose-400" /></motion.div>}
            </h1>
            <p className="text-muted-foreground mt-1">
              Page {cursorHistory.length + 1} • Viewing {filteredCandidates.length} potential sparks.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter current view..."
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
            <h3 className="text-xl font-medium">No candidates yet</h3>
            <p className="text-muted-foreground">The quest is still young. Keep sharing the landing page!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCandidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-rose-100/50 hover:border-rose-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-bold line-clamp-1">{candidate.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a href={`https://instagram.com/${candidate.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-rose-600 flex items-center gap-1 text-xs font-semibold hover:underline bg-rose-50 px-2 py-0.5 rounded">
                              <Instagram className="w-3 h-3" /> {candidate.instagram}
                            </a>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Manage</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => window.open(`mailto:${candidate.email}`)} className="cursor-pointer">
                              <Mail className="mr-2 h-4 w-4" /> Email Candidate
                            </DropdownMenuItem>
                            {candidate.linkedIn && (
                              <DropdownMenuItem onClick={() => window.open(candidate.linkedIn, '_blank')} className="cursor-pointer">
                                <ExternalLink className="mr-2 h-4 w-4" /> LinkedIn Profile
                              </DropdownMenuItem>
                            )}
                            {candidate.resumeUrl && (
                              <DropdownMenuItem onClick={() => window.open(candidate.resumeUrl, '_blank')} className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" /> View Portfolio
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
                              onClick={() => handleDelete(candidate.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4 pt-0">
                      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {candidate.email}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {candidate.phone || 'No phone provided'}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
                          <User className="w-3 h-3" /> The "Why Me"
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3 italic">
                          "{candidate.motivation}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">
                          {candidate.experienceLevel.replace('-', ' ')}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">ID: {candidate.id.split('-')[0]}</span>
                      </div>
                      <Separator className="bg-rose-50" />
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
                          <Heart className="w-3 h-3" /> Ideal Date
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">{candidate.dateIdea}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/30 dark:bg-slate-900/30 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase">
                        <Calendar className="w-3 h-3" />
                        {new Date(candidate.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="mt-12 flex items-center justify-between px-2 bg-secondary/10 p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground">
            {filteredCandidates.length > 0 ? `Showing results ${cursorHistory.length * FETCH_LIMIT + 1} - ${cursorHistory.length * FETCH_LIMIT + filteredCandidates.length}` : 'No results found'}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={cursorHistory.length === 0}
              className="gap-1 rounded-full h-10 px-4"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!data?.next}
              className="gap-1 rounded-full h-10 px-4"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}