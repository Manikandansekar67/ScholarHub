import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, GraduationCap, Clock } from "lucide-react";

export interface Scholarship {
  _id: string; // Backend uses _id
  title: string;
  sponsor: {
    _id: string;
    fullName: string;
    organization: string;
  };
  amount: number;
  deadline: string;
  eligibility: string[];
  category: string;
  description: string;
  status?: "open" | "closing-soon" | "closed";
}

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

const ScholarshipCard = ({ scholarship }: ScholarshipCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (scholarship.status === "closing-soon") {
      return (
        <Badge variant="outline" className="status-warning border">
          <Clock className="h-3 w-3 mr-1" />
          Closing Soon
        </Badge>
      );
    }
    if (scholarship.status === "closed") {
      return (
        <Badge variant="outline" className="status-rejected border">
          Closed
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="status-approved border">
        Open
      </Badge>
    );
  };

  return (
    <Card className="card-elevated h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="text-xs">
            {scholarship.category}
          </Badge>
          {getStatusBadge()}
        </div>
        <h3 className="text-lg font-semibold text-foreground mt-2 line-clamp-2">
          {scholarship.title}
        </h3>
        <p className="text-sm text-muted-foreground">{scholarship.sponsor.organization || scholarship.sponsor.fullName}</p>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {scholarship.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-success" />
            <span className="font-semibold text-foreground">
              {formatCurrency(scholarship.amount)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(scholarship.deadline)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span className="line-clamp-1">{scholarship.eligibility[0]}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <Button asChild className="w-full" disabled={scholarship.status === "closed"}>
          <Link to={`/scholarships/${scholarship._id}`}>
            {scholarship.status === "closed" ? "Closed" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScholarshipCard;
