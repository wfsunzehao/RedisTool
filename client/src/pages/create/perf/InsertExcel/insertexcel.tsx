import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Upload, FileText, Download } from 'lucide-react';

const TxtExcelMerger: React.FC = () => {
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const fileNameStartRowMap: Record<string, number> = {
    'Verifyperformance-P1': 3,
    'Verifyperformance-P2': 4,
    'Verifyperformance-P3': 5,
    'Verifyperformance-P4': 6,
    'Verifyperformance-P5': 7,
    'Verifyperformance-C0-EUS2E-Standard': 12,
    'Verifyperformance-C1-EUS2E-Standard': 13,
    'Verifyperformance-C2-EUS2E-Standard': 14,
    'Verifyperformance-C3-EUS2E-Standard': 15,
    'Verifyperformance-C4-EUS2E-Standard': 16,
    'Verifyperformance-C5-EUS2E-Standard': 17,
    'Verifyperformance-C6-EUS2E-Standard': 18,
    'Verifyperformance-C0-EUS2E-Basic': 23,
    'Verifyperformance-C1-EUS2E-Basic': 24,
    'Verifyperformance-C2-EUS2E-Basic': 25,
    'Verifyperformance-C3-EUS2E-Basic': 26,
    'Verifyperformance-C4-EUS2E-Basic': 27,
    'Verifyperformance-C5-EUS2E-Basic': 28,
    'Verifyperformance-C6-EUS2E-Basic': 29,
  };

  const startColumn = 13;

  const handleMerge = async () => {
    if (!txtFile || !xlsxFile) {
      alert('Please upload both .txt and .xlsx files');
      return;
    }

    const txtContent = await txtFile.text();
    const segments = txtContent.split(/Results from:/).filter(Boolean);

    const workbook = new ExcelJS.Workbook();
    const buffer = await xlsxFile.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet('20241008') || workbook.worksheets[0];
    const newLog: string[] = [];

    for (const segment of segments) {
      const lines = segment.trim().split('\n');
      const fileName = lines[0].trim();
      const jsonStr = lines.slice(1).join('\n');

      const matchedKey = Object.keys(fileNameStartRowMap).find(key => fileName.includes(key));
      if (!matchedKey) {
        newLog.push(`❌ Unrecognized file name: ${fileName}`);
        continue;
      }

      const startRow = fileNameStartRowMap[matchedKey];

      try {
        const data = JSON.parse(jsonStr);

        const values = [
          data.GetsRPS,
          data.TotalDuration,
          data.GetsP50,
          data.GetsP99,
          data.GetsP99_90,
          data.GetsP99_99,
        ];

        values.forEach((val, i) => {
          sheet.getCell(startRow, startColumn + i).value = val;
        });

        newLog.push(`✅ Successfully wrote: ${fileName}`);
      } catch (err) {
        newLog.push(`❌ Failed to parse JSON: ${fileName}`);
      }
    }

    const outBuffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([outBuffer]), 'modified_performance_result.xlsx');
    setLog(newLog);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-10 rounded-2xl shadow-2xl bg-white border border-gray-300 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800">📊 Benchmark Result Integration Tool</h1>

      {/* TXT Upload */}
      <div className="space-y-3">
        <label className="block font-medium text-gray-700 flex items-center gap-2 text-lg">
          <Upload className="w-6 h-6 text-blue-500" />
          Upload `.txt` Benchmark Result File
        </label>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => document.getElementById('txt-input')?.click()}
            className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            Select TXT File
          </button>
          <span className="text-md text-gray-600">
            {txtFile ? txtFile.name : 'No file selected'}
          </span>
        </div>
        <input
          id="txt-input"
          type="file"
          accept=".txt"
          className="hidden"
          onChange={e => setTxtFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Excel Upload */}
      <div className="space-y-3">
        <label className="block font-medium text-gray-700 flex items-center gap-2 text-lg">
          <FileText className="w-6 h-6 text-green-500" />
          Upload `.xlsx` Excel Template
        </label>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => document.getElementById('xlsx-input')?.click()}
            className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition transform hover:scale-105"
          >
            Select Excel File
          </button>
          <span className="text-md text-gray-600">
            {xlsxFile ? xlsxFile.name : 'No file selected'}
          </span>
        </div>
        <input
          id="xlsx-input"
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={e => setXlsxFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Merge Button */}
      <button
        onClick={handleMerge}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg flex justify-center items-center gap-2 transition transform hover:scale-105"
      >
        <Download className="w-6 h-6" />
        Merge and Download Excel
      </button>

      {/* Log Output */}
      {log.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-5 space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">📋 Merge Log</h2>
          {log.map((entry, i) => (
            <div
              key={i}
              className={`text-sm px-3 py-2 rounded-lg shadow-sm ${
                entry.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {entry}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TxtExcelMerger;
