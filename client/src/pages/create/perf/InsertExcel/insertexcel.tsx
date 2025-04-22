import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
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

      const matchedKey = Object.keys(fileNameStartRowMap).find(key =>
        fileName.includes(key)
      );
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
    <Box
      sx={{
        minHeight: '100vh',
        px: 4,
        py: 8,
        backgroundColor: '#fff', // 或者 theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 标题 */}
      <Typography
        variant="h3"
        fontWeight="bold"
        color="primary"
        mb={6}
        sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}
      >
        📊 Benchmark Result Integration Tool
      </Typography>

      {/* 上传区域 */}
      <Stack spacing={5} width="100%" maxWidth={700}>
        {/* TXT 上传 */}
        <Box>
          <Typography variant="h6" mb={1} display="flex" alignItems="center" gap={1}>
            <Upload size={20} />
            Upload `.txt` Benchmark Result File
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label" color="primary" sx={{ fontWeight: 600 }}>
              Select TXT File
              <input
                type="file"
                accept=".txt"
                hidden
                onChange={e => setTxtFile(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="body2">
              {txtFile ? txtFile.name : 'No file selected'}
            </Typography>
          </Stack>
        </Box>

        {/* Excel 上传 */}
        <Box>
          <Typography variant="h6" mb={1} display="flex" alignItems="center" gap={1}>
            <FileText size={20} />
            Upload `.xlsx` Excel Template
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label" color="success" sx={{ fontWeight: 600 }}>
              Select Excel File
              <input
                type="file"
                accept=".xlsx"
                hidden
                onChange={e => setXlsxFile(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="body2">
              {xlsxFile ? xlsxFile.name : 'No file selected'}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* 合并按钮 */}
      <Box mt={6}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleMerge}
          startIcon={<Download />}
          sx={{ px: 5, py: 2, fontWeight: 'bold', borderRadius: 2 }}
        >
          Merge and Download Excel
        </Button>
      </Box>

      {/* 日志显示 */}
      {log.length > 0 && (
        <Box mt={6} width="100%" maxWidth={700}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            📋 Merge Log
          </Typography>
          <Stack spacing={1}>
            {log.map((entry, idx) => (
              <Alert
                key={idx}
                severity={entry.includes('✅') ? 'success' : 'error'}
              >
                {entry}
              </Alert>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TxtExcelMerger;
