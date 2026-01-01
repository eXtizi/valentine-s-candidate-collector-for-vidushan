import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, Sparkles, Send, Instagram, CheckCircle2, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Toaster, toast } from 'sonner';
import { api } from '@/lib/api-client';
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  instagram: z.string().min(1, "Social handle is required").startsWith("@", "Handle must start with @"),
  whyMe: z.string().min(10, "Tell us a bit more! (min 10 characters)"),
  dateIdea: z.string().min(10, "Give us some details! (min 10 characters)"),
});
type FormValues = z.infer<typeof formSchema>;
export function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      instagram: "@",
      whyMe: "",
      dateIdea: "",
    },
  });
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await api('/api/candidates', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      setSubmitted(true);
      toast.success("Application sent successfully!");
    } catch (error) {
      toast.error("Failed to send application. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const scrollToApply = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-background selection:bg-rose-100 selection:text-rose-900">
      <ThemeToggle />
      <Toaster richColors />
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-6 border border-rose-100 uppercase tracking-widest">
            <Heart className="w-3 h-3 fill-current" /> Valentine's 2024
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6">
            Win a Date with <span className="text-rose-600">Vidushan</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
            Looking for someone special to share a memorable Valentine's evening. Simple, elegant, and uniquely us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={scrollToApply} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 h-14 text-lg">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-rose-200 text-rose-600 hover:bg-rose-50">
              View Bio
            </Button>
          </div>
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={scrollToApply}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>
      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-display font-bold">About Vidushan</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An explorer of both city streets and hidden landscapes. Vidushan appreciates the finer things: 
              deep conversations over coffee, the perfect sunset, and genuine connection. He's looking 
              for someone who brings their own spark to the table.
            </p>
            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-secondary border border-border">
                <Sparkles className="w-5 h-5 text-rose-500 mb-2" />
                <span className="text-sm font-medium">Authentic</span>
              </div>
              <div className="p-4 rounded-2xl bg-secondary border border-border">
                <Heart className="w-5 h-5 text-rose-500 mb-2" />
                <span className="text-sm font-medium">Romantic</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-rose-100"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000" 
              alt="Portrait" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </div>
      {/* Application Form */}
      <section id="apply-form" className="py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">The Application</h2>
            <p className="text-muted-foreground">Keep it real, keep it you. We'll be reviewing every single one.</p>
          </div>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-xl bg-background/80 backdrop-blur">
                  <CardContent className="p-8 md:p-12">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jane Doe" className="h-12" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram Handle</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input placeholder="@username" className="pl-10 h-12" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="whyMe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why would we vibe?</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="What makes you... you?" 
                                  className="min-h-[120px] resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateIdea"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Perfect Date Idea</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="A quiet rooftop, a bustling night market, or a spontaneous drive?" 
                                  className="min-h-[120px] resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-lg font-semibold"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <span className="animate-pulse">Sending...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              Send Application <Send className="w-4 h-4" />
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12 bg-white rounded-3xl shadow-xl border border-rose-100"
              >
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-3">Application Sent!</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Thanks for reaching out! Vidushan will review your profile and get in touch if it's a match.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-full">
                  Send Another
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <footer className="py-12 text-center text-muted-foreground border-t border-border">
        <p className="text-sm">Made with ❤��� for Vidushan's Valentine Quest</p>
      </footer>
    </div>
  );
}