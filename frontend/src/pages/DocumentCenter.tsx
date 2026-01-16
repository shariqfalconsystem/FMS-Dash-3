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

  const [copySuccess, setCopySuccess] = useState<string>("");

  const toggleDoc = (id: number) => setOpenDoc(openDoc === id ? null : id);

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
    pdf.setFontSize(18);
    pdf.text(doc.title, 14, 22);
    pdf.setFontSize(12);
    pdf.text(pdf.splitTextToSize(doc.content, 180), 14, 32);
    pdf.save(`${doc.title}.pdf`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 1500); // Reset message
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-300 text-gray-700">
              <FaBook />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Documentation Center
              </h1>
              <p className="text-gray-600 text-sm">
                Guides, FAQs and help resources
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition"
          >
            <FaPlus /> Add Document
          </button>
        </div>

        {/* Search + Category Filters */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
          <div className="relative max-w-xl">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Account", "Usage", "FAQs", "Other"].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(cat as typeof selectedCategory)
                }
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <AccordionItem
                key={doc.id}
                doc={doc}
                isOpen={openDoc === doc.id}
                toggle={() => toggleDoc(doc.id)}
                downloadPDF={downloadPDF}
                copyToClipboard={copyToClipboard}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No documents found.</p>
          )}
        </div>

        {/* Copy feedback */}
        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {copySuccess}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                New Document
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                placeholder="Title"
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, title: e.target.value })
                }
              />
              <select
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
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
                rows={5}
                placeholder="Content"
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                value={newDoc.content}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, content: e.target.value })
                }
              />
              <button
                onClick={() => {
                  setDocs([...docs, { id: Date.now(), ...newDoc }]);
                  setIsModalOpen(false);
                  setNewDoc({ title: "", category: "Account", content: "" });
                }}
                className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm hover:bg-gray-300 transition"
              >
                Save Document
              </button>
            </div>
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
  copyToClipboard: (text: string) => void;
}

function AccordionItem({
  doc,
  isOpen,
  toggle,
  downloadPDF,
  copyToClipboard,
}: AccordionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    setHeight(isOpen ? `${ref.current?.scrollHeight}px` : "0px");
  }, [isOpen]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-6 py-4 text-left text-sm font-semibold text-gray-800"
      >
        <span>{doc.title}</span>
        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={ref}
        style={{ height }}
        className="overflow-hidden transition-all duration-300 px-6"
      >
        <div className="py-4 space-y-3 text-gray-700 text-sm">
          <p className="whitespace-pre-line">{doc.content}</p>
          <div className="flex gap-3">
            <button
              onClick={() => downloadPDF(doc)}
              className="flex items-center gap-2 px-4 py-1.5 text-xs bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={() => copyToClipboard(doc.content)}
              className="flex items-center gap-2 px-4 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              <FaCopy /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
