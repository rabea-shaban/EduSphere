"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Trash2, HelpCircle } from "lucide-react";

import {
  Button,
  Label,
  Input,
  PasswordInput,
  SearchInput,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  MultiSelect,
  Badge,
  Chip,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
  Textarea,
  Skeleton,
  Progress,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  EmptyState,
} from "@/components/ui";

import {
  Logo,
  ThemeToggle,
  LanguageSwitcher,
  PageLoader,
  NoData,
  ErrorMessage,
  ComingSoon,
} from "@/components/common";

import { PageHeader, Container, Section, SectionTitle } from "@/components/layout";

export default function DesignSystemDashboard() {
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [demoProgress, setDemoProgress] = useState(65);

  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => {}, []),
    () => true,
    () => false
  );

  const multiselectOptions = [
    { label: "React Programming", value: "react" },
    { label: "Tailwind Styling", value: "tailwind" },
    { label: "Next.js App Router", value: "next" },
    { label: "TypeScript Foundation", value: "typescript" },
  ];

  const breadcrumbs = [
    { label: "EduSphere", href: "#" },
    { label: "Core Architecture", href: "#" },
    { label: "Design System Showcase", active: true },
  ];

  if (!mounted) {
    return <PageLoader message="Loading Design System Showcase..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/85 backdrop-blur-md px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Container className="py-8">
        {/* Page Header */}
        <PageHeader
          title="SaaS Design System"
          description="A complete directory of all reusable components, styled colors, responsive layouts, and accessibility controllers built for the EduSphere LMS."
          breadcrumbs={breadcrumbs}
          actions={
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 1500)),
                  {
                    loading: "Syncing design tokens...",
                    success: () => {
                      setIsLoading(false);
                      return "Tokens synced successfully!";
                    },
                    error: "Sync failed.",
                  }
                );
              }}
              loading={isLoading}
              iconRight={<Sparkles />}
            >
              Sync Tokens
            </Button>
          }
        />

        <Tabs defaultValue="primitives" className="w-full">
          <TabsList className="w-full flex justify-start overflow-x-auto gap-1 mb-8 max-w-2xl bg-muted/60">
            <TabsTrigger value="primitives">UI Primitives</TabsTrigger>
            <TabsTrigger value="forms">Forms & Selection</TabsTrigger>
            <TabsTrigger value="overlays">Overlays & States</TabsTrigger>
            <TabsTrigger value="utilities">Layouts & Utilities</TabsTrigger>
          </TabsList>

          {/* TAB 1: UI PRIMITIVES */}
          <TabsContent value="primitives" className="space-y-8 animate-slide-in">
            <Section spacing="none">
              <SectionTitle
                title="Buttons & Badges"
                subtitle="Primary commands, click handlers, and status labels."
              />
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>Click targets with micro-interactive click compressions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="default">Default Navy</Button>
                  <Button variant="secondary">Secondary Blue</Button>
                  <Button variant="outline">Outline Grey</Button>
                  <Button variant="ghost">Ghost Plain</Button>
                  <Button variant="success">Success Green</Button>
                  <Button variant="warning">Warning Yellow</Button>
                  <Button variant="danger">Danger Red</Button>
                  <Button variant="link">Link Anchor</Button>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center gap-3">
                  <Button variant="default" size="sm">Small</Button>
                  <Button variant="default" size="default">Normal</Button>
                  <Button variant="default" size="lg">Large View</Button>
                  <Button variant="outline" size="icon" aria-label="Settings icon button">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button variant="default" loading={true}>Processing</Button>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Badges & Chips</CardTitle>
                    <CardDescription>Indicators for categories, filters, and status states.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2.5">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info State</Badge>
                  </CardContent>
                  <CardContent className="flex flex-wrap gap-2 pt-0">
                    <Chip label="Filter Topic" onClick={() => toast.info("Chip clicked")} />
                    <Chip label="Selected Category" active={true} />
                    <Chip
                      label="Dismissible Tag"
                      onDelete={() => toast.success("Tag deleted")}
                      active={true}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Avatars & Skeleton Loading</CardTitle>
                    <CardDescription>User profile blocks and placeholder shimmers.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Avatar status="online">
                        <AvatarImage src="https://github.com/nutlope.png" alt="Profile" />
                        <AvatarFallback>NS</AvatarFallback>
                      </Avatar>
                      <Avatar status="away">
                        <AvatarFallback>AW</AvatarFallback>
                      </Avatar>
                      <Avatar status="busy">
                        <AvatarFallback>BY</AvatarFallback>
                      </Avatar>
                      <Avatar status="offline">
                        <AvatarFallback>OL</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3.5 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress & Tooltip */}
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>Dynamic Progress Bar</CardTitle>
                    <CardDescription>Percent loader for course syllabus completion.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={demoProgress} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                      <span>Completed: {demoProgress}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={() =>
                          setDemoProgress((prev) => (prev >= 100 ? 10 : prev + 15))
                        }
                      >
                        Advance Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tooltips & Floating Popovers</CardTitle>
                    <CardDescription>Hover overlays for contextual metadata.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" iconLeft={<HelpCircle />}>
                            Hover Info
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This is a custom-animated tooltip container.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">Open Popover</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <h4 className="font-semibold text-sm">Course Outline Settings</h4>
                        <p className="text-xs text-muted-foreground mt-1">Configure layout, view, and sharing properties directly from this popover overlay.</p>
                      </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Open Menu</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Account Preferences</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.info("Profile clicked")}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Settings clicked")}>
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-danger focus:bg-danger/10 focus:text-danger"
                          onClick={() => toast.error("Session closed")}
                        >
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              </div>
            </Section>
          </TabsContent>

          {/* TAB 2: FORMS & SELECTION */}
          <TabsContent value="forms" className="space-y-8 animate-slide-in">
            <Section spacing="none">
              <SectionTitle
                title="Input Controls & Form Fields"
                subtitle="Data entries, passwords, search fields, and state selectors."
              />
              <Card>
                <CardHeader>
                  <CardTitle>Text Entries</CardTitle>
                  <CardDescription>Configured fields with active outline rings and error indicators.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="std-input">Standard Text Input</Label>
                      <Input id="std-input" placeholder="Type text here..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pass-input">Password Field</Label>
                      <PasswordInput id="pass-input" placeholder="Enter security key..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="search-box">Search Queries</Label>
                      <SearchInput id="search-box" placeholder="Filter courses..." />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="desc-area">Detailed Description</Label>
                    <Textarea id="desc-area" placeholder="Provide course descriptions here..." />
                  </div>
                </CardContent>
              </Card>

              {/* Checkboxes & Switches */}
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Toggles & Binary Selectors</CardTitle>
                    <CardDescription>Option switches and checkboxes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-center gap-3">
                      <Checkbox id="terms-agree" />
                      <Label htmlFor="terms-agree" className="cursor-pointer">
                        I accept platform service terms and usage conditions
                      </Label>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notif">Email Alerts</Label>
                        <p className="text-xs text-muted-foreground">Receive course updates and student requests.</p>
                      </div>
                      <Switch id="email-notif" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Selection Selectors</CardTitle>
                    <CardDescription>Radix select controls and badge-tag multiselects.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Course Rating Scope</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All rating levels</SelectItem>
                          <SelectItem value="popular">Most popular (4.5+ rating)</SelectItem>
                          <SelectItem value="beginner">Beginner friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Selected Modules</Label>
                      <MultiSelect
                        options={multiselectOptions}
                        selected={selectedMulti}
                        onChange={setSelectedMulti}
                        placeholder="Choose topic focus areas..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Radio Group Selection */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Radio Selection Groups</CardTitle>
                  <CardDescription>Select single option from listings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="admin" className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="admin" id="r-admin" />
                      <Label htmlFor="r-admin" className="cursor-pointer">LMS Administrator Dashboard</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="instructor" id="r-instructor" />
                      <Label htmlFor="r-instructor" className="cursor-pointer">Instructor Course Editor</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* TAB 3: OVERLAYS & STATES */}
          <TabsContent value="overlays" className="space-y-8 animate-slide-in">
            <Section spacing="none">
              <SectionTitle
                title="Overlays, Dialogs & Collapsibles"
                subtitle="Popups, drawers, accordions, and system banners."
              />
              <Card>
                <CardHeader>
                  <CardTitle>Dialog overlays & slide-in drawers</CardTitle>
                  <CardDescription>Modals, drawers, and side sheet templates.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  {/* Standard Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enroll New Learner</DialogTitle>
                        <DialogDescription>Input learner account details to enroll them into this course.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="std-email">Learner Email</Label>
                          <Input id="std-email" type="email" placeholder="learner@edusphere.com" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="default" onClick={() => toast.success("Enrolled")}>Confirm Enrollment</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="danger">Delete Course</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the course, files, lessons, and remove all enrolled student records. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success("Course deleted successfully")}>
                          Delete Course
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* Side Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Side Sheet</Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Platform Filter Controls</SheetTitle>
                        <SheetDescription>Refine search queries for lessons and curriculum content.</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-6">
                        <div className="space-y-1.5">
                          <Label>Course Categories</Label>
                          <Input placeholder="E.g., design, programming" />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Bottom Drawer */}
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline">Open Bottom Drawer</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Quick Navigation Menu</DrawerTitle>
                        <DrawerDescription>Access settings, billing tabs, or support request details instantly.</DrawerDescription>
                      </DrawerHeader>
                      <div className="py-6 flex flex-col gap-2">
                        <Button variant="ghost" className="justify-start">Account Profile</Button>
                        <Button variant="ghost" className="justify-start">Support Ticket Center</Button>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline" className="w-full">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>

              {/* Accordions */}
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>FAQ Accordion Columns</CardTitle>
                    <CardDescription>Collapsible panels showing info summaries.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Is the certificate verified?</AccordionTrigger>
                        <AccordionContent>
                          Yes, upon course syllabus completion, certified documents are generated automatically.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How long is the access key valid?</AccordionTrigger>
                        <AccordionContent>
                          You gain lifetime access to all purchased learning materials and forum pages.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alert Banners</CardTitle>
                    <CardDescription>Notifications for status announcements.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3.5">
                    <Alert variant="info">
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle>Server Update</AlertTitle>
                      <AlertDescription>Curriculum models will upgrade tonight at 02:00 UTC.</AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <Trash2 className="h-4 w-4" />
                      <AlertTitle>Action Expired</AlertTitle>
                      <AlertDescription>Security authorization keys expired. Please refresh your session.</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Empty state illustration check */}
              <div className="mt-6">
                <EmptyState
                  title="No Registered Courses"
                  description="Your student account has not enrolled into any courses yet. Explore our curriculum catalog to begin."
                  actionText="Explore Course Catalog"
                  onAction={() => toast.success("Redirecting to catalog page...")}
                />
              </div>
            </Section>
          </TabsContent>

          {/* TAB 4: LAYOUTS & UTILITIES */}
          <TabsContent value="utilities" className="space-y-8 animate-slide-in">
            <Section spacing="none">
              <SectionTitle
                title="Common Sections & Utility Indicators"
                subtitle="Page loaders, inline alerts, count-downs, and pagination controls."
              />
              <Card>
                <CardHeader>
                  <CardTitle>Pagination</CardTitle>
                  <CardDescription>Direction-aware arrow keys and list page navigators.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={8}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inline Alerts & NoData Indicators</CardTitle>
                    <CardDescription>Inline warning flags and empty state labels.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ErrorMessage message="Invalid registration details. Please verify your email domain." />
                    <Separator />
                    <NoData message="No students are enrolled in this module." />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Coming Soon Notice</CardTitle>
                    <CardDescription>Future modules placeholder screen card.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ComingSoon
                      moduleName="Student Examination Dashboard"
                      expectedDate="Sept 15, 2026"
                      onNotifyMe={() => toast.success("Added to alert notifications list")}
                    />
                  </CardContent>
                </Card>
              </div>
            </Section>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
