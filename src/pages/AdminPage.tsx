import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, Calendar, User, Heart, Search, Filter,
  Download, Mail, Phone, ExternalLink, ArrowUpDown,
  ChevronRight, ChevronLeft, MoreHorizontal, Briefcase, FileText,
  Trash2, RefreshCw, Lock, Sparkles, X
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
const FETCH_LIMIT = 100;
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
        c.motivation.toLowerCase().includes(s) ||
        c.dateIdea.toLowerCase().includes(s)
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
      toast.error("Invalid secret key.");
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
    if (filteredCandidates.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Instagram", "LinkedIn", "Experience", "Motivation", "Date Idea", "Availability", "Created At"];
    const rows = filteredCandidates.map(c => [
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
    link.setAttribute("download", `vidushan_quest_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info(`Exported ${filteredCandidates.length} filtered records`);
  };
  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this application?")) {
      deleteMutation.mutate(id);
    }
  };
  if (isChecking) return null;
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl">
        <Toaster richColors position="top-center" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-8">
          <Card className="border-rose-100 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-500 to-amber-500" />
            <CardHeader className="text-center pt-10">
              <Lock className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <CardTitle className="text-3xl font-display font-bold">Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  type="password"
                  placeholder="Secret Key"
                  className="h-14 rounded-2xl text-center text-xl tracking-[0.5em] font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <Button type="submit" className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-lg font-bold">
                  Enter Portal
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
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
              <Badge variant="outline" className="border-rose-200 text-rose-600">Admin Dashboard</Badge>
            </div>
            <h1 className="text-4xl font-display font-bold flex items-center gap-3">
              Candidate Review
              {isFetching && <RefreshCw className="w-5 h-5 text-rose-400 animate-spin" />}
            </h1>
            <p className="text-muted-foreground mt-1">
              Showing {filteredCandidates.length} of {data?.items.length || 0} applications on this page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-10 pr-10 w-full md:w-[260px] bg-secondary border-none h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button variant="outline" onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')} className="gap-2 h-10">
              <ArrowUpDown className="w-4 h-4" /> {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </Button>
            <Button variant="default" onClick={downloadCSV} disabled={filteredCandidates.length === 0} className="bg-rose-600 hover:bg-rose-700 gap-2 h-10">
              <Download className="w-4 h-4" /> Export Filtered
            </Button>
          </div>
        </header>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-32 bg-secondary/20 rounded-3xl border-2 border-dashed">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-medium">{search ? "No matches found" : "No candidates yet"}</h3>
            <p className="text-muted-foreground mb-6">{search ? "Try adjusting your search terms" : "Share the application link to get started"}</p>
            {search && <Button onClick={() => setSearch('')} variant="link" className="text-rose-600">Clear Search</Button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCandidates.map((candidate) => (
                <motion.div key={candidate.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-all border-rose-100/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 overflow-hidden">
                          <CardTitle className="text-xl font-bold truncate">{candidate.name}</CardTitle>
                          <a href={`https://instagram.com/${candidate.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-rose-600 text-xs font-semibold hover:underline block truncate">
                            {candidate.instagram}
                          </a>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(`mailto:${candidate.email}`)}><Mail className="mr-2 h-4 w-4" /> Email</DropdownMenuItem>
                            {candidate.linkedIn && <DropdownMenuItem onClick={() => window.open(candidate.linkedIn, '_blank')}><ExternalLink className="mr-2 h-4 w-4" /> LinkedIn</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(candidate.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">The Motivation</h4>
                        <p className="text-sm line-clamp-4 italic text-foreground/80">"{candidate.motivation}"</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Heart className="w-3 h-3" /> Date Idea</h4>
                        <p className="text-sm line-clamp-2">{candidate.dateIdea}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="secondary" className="text-[10px]">{candidate.experienceLevel}</Badge>
                        <span className="text-[10px] text-muted-foreground">ID: {candidate.id.slice(0, 8)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 py-3 text-[10px] text-muted-foreground font-bold flex justify-between">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(candidate.createdAt).toLocaleDateString()}</span>
                      {candidate.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {candidate.phone}</span>}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="mt-12 flex items-center justify-between p-4 bg-secondary/10 rounded-xl border">
          <p className="text-sm text-muted-foreground">Page {cursorHistory.length + 1}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={cursorHistory.length === 0}>Previous</Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!data?.next}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}