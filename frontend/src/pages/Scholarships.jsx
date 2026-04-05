import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScholarshipCard from "@/components/ScholarshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { scholarshipAPI } from "@/lib/api";
const categories = ["All", "STEM", "Arts", "Leadership", "Need-Based", "Business", "Healthcare"];
const amountRanges = [{
  label: "Any Amount",
  value: "any"
}, {
  label: "Under $5,000",
  value: "under-5000"
}, {
  label: "$5,000 - $10,000",
  value: "5000-10000"
}, {
  label: "$10,000 - $15,000",
  value: "10000-15000"
}, {
  label: "Over $15,000",
  value: "over-15000"
}];
const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [amountRange, setAmountRange] = useState("any");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    data: scholarshipsResponse,
    isLoading,
    error
  } = useQuery({
    queryKey: ["scholarships"],
    queryFn: () => scholarshipAPI.getAll()
  });
  const allScholarships = scholarshipsResponse?.data || [];
  const filteredScholarships = allScholarships.filter(scholarship => {
    // Search filter
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) || (scholarship.sponsor.organization || scholarship.sponsor.fullName).toLowerCase().includes(searchQuery.toLowerCase()) || scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === "All" || scholarship.category === selectedCategory;

    // Amount filter
    let matchesAmount = true;
    if (amountRange === "under-5000") matchesAmount = scholarship.amount < 5000; else if (amountRange === "5000-10000") matchesAmount = scholarship.amount >= 5000 && scholarship.amount <= 10000; else if (amountRange === "10000-15000") matchesAmount = scholarship.amount > 10000 && scholarship.amount <= 15000; else if (amountRange === "over-15000") matchesAmount = scholarship.amount > 15000;

    // Status filter
    const matchesStatus = statusFilter === "all" || scholarship.status === statusFilter;
    return matchesSearch && matchesCategory && matchesAmount && matchesStatus;
  });
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setAmountRange("any");
    setStatusFilter("all");
  };
  const hasActiveFilters = searchQuery || selectedCategory !== "All" || amountRange !== "any" || statusFilter !== "all";
  return <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1">
      {/* Page Header */}
      <section className="border-b border-border bg-muted/30 py-10">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse Scholarships
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your goals and eligibility
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border py-6 sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search scholarships..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={amountRange} onValueChange={setAmountRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Amount" />
                </SelectTrigger>
                <SelectContent>
                  {amountRanges.map(range => <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closing-soon">Closing Soon</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>}
            </div>
          </div>

          {/* Active filter tags */}
          {hasActiveFilters && <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>}
            {selectedCategory !== "All" && <Badge variant="secondary" className="gap-1">
              {selectedCategory}
              <button onClick={() => setSelectedCategory("All")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>}
          </div>}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredScholarships.length}</span> scholarships
            </p>
          </div>

          {isLoading ? <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : error ? <div className="text-center py-16 text-destructive">
            <p>Failed to load scholarships. Please try again later.</p>
          </div> : filteredScholarships.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map(scholarship => <ScholarshipCard key={scholarship._id} scholarship={scholarship} />)}
          </div> : <div className="text-center py-16">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No scholarships found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>}
        </div>
      </section>
    </main>

    <Footer />
  </div>;
};
export default Scholarships;