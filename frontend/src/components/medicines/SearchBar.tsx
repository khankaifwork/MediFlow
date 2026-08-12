import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search
        size={20}
        className="absolute left-3 top-3 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search medicine..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
      />
    </div>
  );
}

export default SearchBar;