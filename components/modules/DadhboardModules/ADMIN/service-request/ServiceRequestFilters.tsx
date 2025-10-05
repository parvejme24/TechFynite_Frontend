import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSearch, FiFilter } from "react-icons/fi";

type Category = { value: string; label: string };

type ServiceRequestFiltersProps = {
  keyword: string;
  setKeyword: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: Category[];
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
};

export default function ServiceRequestFilters({
  keyword,
  setKeyword,
  category,
  setCategory,
  categories,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}: ServiceRequestFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by name, email, company..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-10 w-64"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex items-center gap-2">
        <FiFilter className="text-gray-400" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Service" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="w-40"
        />
        <span>to</span>
        <Input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="w-40"
        />
      </div>
    </div>
  );
}
