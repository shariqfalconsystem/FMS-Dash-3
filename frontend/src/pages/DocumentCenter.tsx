// DocumentationCenter.tsx
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import {
  FaChevronDown,
  FaSearch,
  FaPlus,
  FaTimes,
  FaCopy,
  FaFilePdf,
  FaBook,
} from "react-icons/fa";

interface DocItem {
  id: number;
  title: string;
  category: "Account" | "Usage" | "FAQs" | "Other";
  content: string;
}

const initialDocs: DocItem[] = [
  {
    id: 1,
    title: "How to Create an Account",
    category: "Account",
    content:
      "1. Visit the homepage.\n2. Click Sign Up.\n3. Enter your details.\n4. Verify your email address.",
  },
  {
    id: 2,
    title: "Logging In",
    category: "Account",
    content:
      "- Go to Login page.\n- Enter email and password.\n- Click Login to access your dashboard.",
  },
  {
    id: 3,
    title: "Resetting Password",
    category: "Account",
    content:
      "- Click Forgot Password.\n- Enter registered email.\n- Follow reset instructions from email.",
  },
  {
    id: 4,
    title: "Using the Dashboard",
    category: "Usage",
    content:
      "- View recent activity.\n- Access modules from sidebar.\n- Update settings anytime.",
  },
  {
    id: 5,
    title: "Search & Filters",
    category: "Usage",
    content:
      "- Use the global search bar.\n- Filter results by category.\n- Quickly locate documents.",
  },
  {
    id: 6,
    title: "Frequently Asked Questions",
    category: "FAQs",
    content:
      "Q: Is my data secure?\nA: Yes, we use industry-standard encryption.",
  },
  {
    id: 7,
    title: "Contacting Support",
    category: "Other",
    content:
      "- Go to Help section.\n- Submit a support request.\n- Our team responds within 24 hours.",
  },
];

export default function DocumentationCenter() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [openDoc, setOpenDoc] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Account" | "Usage" | "FAQs" | "Other"
  >("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    category: "Account" as DocItem["category"],
    content: "",
  });

  const toggleDoc = (id: number) =>
    setOpenDoc(openDoc === id ? null : id);

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const downloadPDF = (doc: DocItem) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(doc.title, 14, 20);
    pdf.setFontSize(11);
    pdf.text(pdf.splitTextToSize(doc.content, 180), 14, 30);
    pdf.save(`${doc.title}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBook className="text-slate-700" />
            <h1 className="text-3xl font-semibold text-slate-900">
              Documentation Center
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
          >
            <FaPlus /> Add Document
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documentation"
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {["All", "Account", "Usage", "FAQs", "Other"].map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat as typeof selectedCategory)
              }
              className={`rounded-md border px-4 py-1.5 text-sm ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="grid gap-4">
          {filteredDocs.map((doc) => (
            <AccordionItem
              key={doc.id}
              doc={doc}
              isOpen={openDoc === doc.id}
              toggle={() => toggleDoc(doc.id)}
              downloadPDF={downloadPDF}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Document</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <input
              placeholder="Title"
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={newDoc.title}
              onChange={(e) =>
                setNewDoc({ ...newDoc, title: e.target.value })
              }
            />
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={newDoc.category}
              onChange={(e) =>
                setNewDoc({
                  ...newDoc,
                  category: e.target.value as DocItem["category"],
                })
              }
            >
              <option>Account</option>
              <option>Usage</option>
              <option>FAQs</option>
              <option>Other</option>
            </select>
            <textarea
              placeholder="Content"
              rows={5}
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={newDoc.content}
              onChange={(e) =>
                setNewDoc({ ...newDoc, content: e.target.value })
              }
            />
            <button
              onClick={() => {
                setDocs([...docs, { id: Date.now(), ...newDoc }]);
                setIsModalOpen(false);
              }}
              className="w-full rounded-md bg-slate-900 py-2 text-sm text-white"
            >
              Save Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  doc: DocItem;
  isOpen: boolean;
  toggle: () => void;
  downloadPDF: (doc: DocItem) => void;
}

function AccordionItem({ doc, isOpen, toggle, downloadPDF }: AccordionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    setHeight(isOpen ? `${ref.current?.scrollHeight}px` : "0px");
  }, [isOpen]);

  return (
    <div className="rounded-lg border bg-white">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-800"
      >
        {doc.title}
        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={ref}
        style={{ height }}
        className="overflow-hidden transition-all duration-300"
      >
        <div className="space-y-4 px-5 py-4 text-sm text-slate-700">
          <p className="whitespace-pre-line">{doc.content}</p>
          <div className="flex gap-2">
            <button
              onClick={() => downloadPDF(doc)}
              className="flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(doc.content)}
              className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs"
            >
              <FaCopy /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
