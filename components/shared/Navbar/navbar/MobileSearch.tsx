import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MobileSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const MobileSearch = ({ searchQuery, setSearchQuery, handleSearch }: MobileSearchProps) => (
  <div className="px-4 mb-5 mt-8">
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-5 rounded-full border-2 border-[#0F5BBD]/20 focus:border-[#0F5BBD] dark:bg-[#1A1D37] dark:border-[#0F5BBD]/30 dark:focus:border-[#0F5BBD]"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </form>
  </div>
); 