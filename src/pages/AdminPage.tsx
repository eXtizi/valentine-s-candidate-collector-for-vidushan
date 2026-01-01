import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Instagram, Calendar, User, Heart, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Candidate } from '@shared/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
export function AdminPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => api<{ items: Candidate[]; next: string | null }>('/api/candidates'),
  });
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Failed to load candidates</h2>
        <p className="text-muted-foreground mt-2">Error: {(error as Error).message}</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold">Candidate Review</h1>
            <p className="text-muted-foreground mt-1">Reviewing potential matches for Valentine's Day.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search candidates..." className="pl-10 w-full md:w-[300px]" />
            </div>
            <Badge variant="outline" className="h-10 px-4 rounded-md flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Badge>
          </div>
        </header>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50">
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (data?.items?.length ?? 0) === 0 ? (
          <div className="text-center py-32 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-medium">No candidates yet</h3>
            <p className="text-muted-foreground">Keep sharing the link, the right one is out there!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow border-rose-50 hover:border-rose-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">{candidate.name}</CardTitle>
                        <a 
                          href={`https://instagram.com/${candidate.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-600 flex items-center gap-1.5 text-sm font-medium mt-1 hover:underline"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          {candidate.instagram}
                        </a>
                      </div>
                      <Badge variant="secondary" className="bg-rose-50 text-rose-600 hover:bg-rose-100">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-6">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                        <User className="w-3 h-3" /> Why Me?
                      </h4>
                      <p className="text-sm leading-relaxed text-foreground/90 italic">"{candidate.whyMe}"</p>
                    </div>
                    <Separator className="bg-rose-50" />
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Heart className="w-3 h-3" /> Date Idea
                      </h4>
                      <p className="text-sm leading-relaxed text-foreground/90">{candidate.dateIdea}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                      <Calendar className="w-3 h-3" />
                      {new Date(candidate.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-white border-rose-100">
                      ID: {candidate.id.split('-')[0]}
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}