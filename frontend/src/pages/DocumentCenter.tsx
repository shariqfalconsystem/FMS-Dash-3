// DocumentationCenter.tsx
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { FaChevronDown, FaSearch, FaPlus, FaTimes, FaCopy, FaFilePdf } from "react-icons/fa";

interface DocItem {
  id: number;
  title: string;
  category: "Account" | "Usage" | "FAQs" | "Other";
  content: string;
}

const initialDocs: DocItem[] = [
  { id: 1, title: "How to Create an Account", category: "Account", content: `1. Go to the website homepage.\n2. Click on the "Sign Up" button at the top right corner.\n3. Fill in your details (Name, Email, Password).\n4. Accept the terms and conditions.\n5. Click "Create Account".\n6. Verify your email by clicking the link sent to your inbox.` },
  { id: 2, title: "How to Use the Website", category: "Usage", content: `- Browse different sections using the top navigation menu.\n- Use the search bar to quickly find pages or articles.\n- Access your profile from the top-right corner to manage settings.\n- Contact support via the "Help" section if you face any issues.` },
  { id: 3, title: "Account Settings", category: "Account", content: `- Update your personal information in the "Profile" section.\n- Change your password under "Security Settings".\n- Enable 2-factor authentication for extra security.` },
  { id: 4, title: "FAQs", category: "FAQs", content: `- **Q:** Can I reset my password?\n  **A:** Yes, click "Forgot Password" on the login page.\n\n- **Q:** How do I delete my account?\n  **A:** Contact support to request account deletion.` },
  { id: 5, title: "Troubleshooting Login Issues", category: "Other", content: `- Clear your browser cache and cookies.\n- Make sure your caps lock is off when typing the password.\n- If the issue persists, contact support with your registered email.` },
  { id: 6, title: "Updating Payment Information", category: "Account", content: `- Go to "Billing" under your profile settings.\n- Add or remove payment methods.\n- Ensure your billing address is up to date.\n- Save changes and confirm updates via email notification.` },
  { id: 7, title: "Navigating the Dashboard", category: "Usage", content: `- Access different modules from the sidebar menu.\n- Use the dashboard overview to track recent activities.\n- Customize your dashboard layout under "Settings".` },
  { id: 8, title: "Security Guidelines", category: "Other", content: `- Never share your password with anyone.\n- Enable 2-factor authentication for additional security.\n- Log out from shared devices after use.\n- Contact support if suspicious activity is detected.` },
  { id: 9, title: "Resetting Your Password", category: "Account", content: `- Go to the login page.\n- Click "Forgot Password".\n- Enter your registered email.\n- Follow the link in the email to reset your password.` },
  { id: 10, title: "Supported Browsers and Devices", category: "FAQs", content: `- Recommended browsers: Chrome, Firefox, Edge, Safari.\n- Mobile devices supported: iOS 14+, Android 10+.\n- Some features may not work on outdated browsers.\n- For optimal performance, keep your browser updated.` },
  { id: 11, title: "Managing Notifications", category: "Account", content: `- Go to "Settings" > "Notifications".\n- Enable or disable email and push notifications.\n- Customize notification preferences for specific activities.` },
  { id: 12, title: "Data Export", category: "Other", content: `- Navigate to "Profile" > "Data Export".\n- Choose the format (CSV, PDF).\n- Click "Export" and download your personal data.` },
  { id: 13, title: "Understanding Billing Cycles", category: "Account", content: `- Billing cycles are monthly by default.\n- You can upgrade to annual billing for discounts.\n- Check your next payment date under "Billing".` },
  { id: 14, title: "Collaborating with Teams", category: "Usage", content: `- Add team members via "Settings" > "Teams".\n- Assign roles and permissions.\n- Track team activity on the dashboard.` },
  { id: 15, title: "Password Security Tips", category: "Other", content: `- Use strong, unique passwords.\n- Change passwords regularly.\n- Avoid using personal information in passwords.` },
  { id: 16, title: "Customizing Your Profile", category: "Account", content: `- Upload a profile picture.\n- Set a display name.\n- Add a short bio for your profile.` },
  { id: 17, title: "Searching Documents", category: "Usage", content: `- Use the search bar at the top.\n- Filter results by category.\n- Highlighted search terms appear in the results.` },
  { id: 18, title: "Account Deactivation", category: "Account", content: `- Go to "Settings" > "Account".\n- Select "Deactivate Account".\n- Follow the instructions to confirm deactivation.` },
  { id: 19, title: "Reporting Issues", category: "Other", content: `- Click "Help" > "Report an Issue".\n- Fill in the form with details.\n- Our support team will contact you within 24 hours.` },
  { id: 20, title: "Integrating with Third-Party Apps", category: "Usage", content: `- Go to "Settings" > "Integrations".\n- Connect supported third-party applications.\n- Manage permissions and access levels for each app.` },
];

export default function DocumentationCenter() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [openDoc, setOpenDoc] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Account" | "Usage" | "FAQs" | "Other">("All");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState<{ title: string; category: DocItem["category"]; content: string }>({
    title: "",
    category: "Account",
    content: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleDoc = (id: number) => setOpenDoc(openDoc === id ? null : id);

  const filteredDocs = docs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddDocument = () => {
    if (!newDoc.title || !newDoc.content) return alert("Please fill all fields");
    const newId = docs.length ? Math.max(...docs.map((d) => d.id)) + 1 : 1;
    setDocs([...docs, { id: newId, ...newDoc }]);
    setNewDoc({ title: "", category: "Account", content: "" });
    setIsModalOpen(false);
  };

  const downloadPDF = (doc: DocItem) => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(doc.title, 14, 22);
    pdf.setFontSize(12);
    pdf.text(pdf.splitTextToSize(doc.content, 180), 14, 32);
    pdf.save(`${doc.title}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Documents Center</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <FaPlus /> New Document
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Browse guides, FAQs, and instructions on using the website. Download or copy any document content.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "Account", "Usage", "FAQs", "Other"].map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(cat as "All" | "Account" | "Usage" | "FAQs" | "Other")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        {paginatedDocs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No documentation found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {paginatedDocs.map((doc) => (
              <AccordionItem
                key={doc.id}
                doc={doc}
                isOpen={openDoc === doc.id}
                toggle={() => toggleDoc(doc.id)}
                downloadPDF={downloadPDF}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 border rounded hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-lg transform transition-all duration-300 ease-out opacity-100 scale-100" style={{ zIndex: 10 }}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">New Document</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as DocItem["category"] })}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Account">Account</option>
                <option value="Usage">Usage</option>
                <option value="FAQs">FAQs</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                placeholder="Content"
                value={newDoc.content}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                rows={6}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button onClick={handleAddDocument} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AccordionItemProps {
  doc: DocItem;
  isOpen: boolean;
  toggle: () => void;
  downloadPDF: (doc: DocItem) => void;
  searchTerm: string;
}

function AccordionItem({ doc, isOpen, toggle, downloadPDF, searchTerm }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    setHeight(isOpen ? `${contentRef.current?.scrollHeight}px` : "0px");
  }, [isOpen]);

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, idx) =>
      regex.test(part) ? (
        <mark key={idx} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:shadow-xl hover:scale-[1.01] bg-white">
      <button
        className="w-full flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all font-semibold text-gray-900 relative overflow-hidden rounded-t-2xl"
        onClick={toggle}
      >
        <span className="text-lg">{doc.title}</span>
        <FaChevronDown className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div ref={contentRef} style={{ height }} className="overflow-hidden transition-all duration-300 ease-in-out px-5 bg-white">
        <div className="py-4 whitespace-pre-line text-gray-700">{highlightText(doc.content, searchTerm)}</div>
        <div className="flex gap-3 pb-4">
          <button onClick={() => downloadPDF(doc)} className="flex items-center gap-2 px-4 py-2 bg-[#003350] text-white rounded-lg hover:bg-[#002233] transition">
            <FaFilePdf /> PDF
          </button>
          <button onClick={() => navigator.clipboard.writeText(doc.content)} className="flex items-center gap-2 px-4 py-2 bg-[#003350] text-white rounded-lg transition">
            <FaCopy /> Copy
          </button>
        </div>
      </div>
    </div>
  );
}
