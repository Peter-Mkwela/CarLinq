// app/dashboard/downloads/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Download, FileText, Image, Archive, Calendar } from 'lucide-react';

export default function DownloadsPage() {
  const downloads = [
    { id: 1, name: 'Website Design Files', type: 'Archive', size: '45.2 MB', date: '2024-01-10' },
    { id: 2, name: 'Data Recovery Report', type: 'Document', size: '2.1 MB', date: '2024-01-15' },
    { id: 3, name: 'Company Logo Package', type: 'Image', size: '18.7 MB', date: '2024-01-12' },
    { id: 4, name: 'Software Documentation', type: 'Document', size: '3.4 MB', date: '2024-01-08' }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'Document': return FileText;
      case 'Image': return Image;
      case 'Archive': return Archive;
      default: return FileText;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Downloads</h1>
          <p className="text-gray-400">Access your completed deliverables and files</p>
        </motion.div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                    <p className="text-sm text-gray-400">{file.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">{file.size}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {file.date}
                  </div>
                </div>
                
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}