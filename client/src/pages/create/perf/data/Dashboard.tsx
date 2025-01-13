// src/components/DataChart.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, Card, Row, Col } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import { useParams } from 'react-router-dom';

interface AllData {
  cacheName: string;
  totalDuration: number;
  timeUnit: string;
  getsRPS: number;
  getsAverageLatency: number;
  getsP50: number;
  getsP99: number;
  getsP99_90: number;
  getsP99_99: number;
  timeStamp:string;
  id: number;
}

interface FinalData {
  id: number;
  cacheName: string;
  totalDuration: number;
  timeUnit: string;
  getsRPS: number;
  getsAverageLatency: number;
  getsP50: number;
  getsP99: number;
  getsP99_90: number;
  getsP99_99: number;
  timeStamp:string;
}

const DataDisplayPage: React.FC = () => {
  const { timeStamp } = useParams<{ timeStamp: string }>(); // 获取 
  const [allData, setAllData] = useState<AllData[]>([]);
  const [finalData, setFinalData] = useState<FinalData[]>([]);
  const [filteredData, setFilteredData] = useState<AllData | null>(null);

  useEffect(() => {
    if (!timeStamp) {
      console.error('Timestamp is undefined!');
      return;
    }
    // 获取AllData数据
    axios.get(`https://localhost:7179/api/Data/AllData?TimeStamp=${timeStamp}`)
      .then((response) => {
        setAllData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching AllData:', error);
      });

    // 获取FinalData数据
    axios.get(`https://localhost:7179/api/Data/FinalData?TimeStamp=${timeStamp}`)
      .then((response) => {
        setFinalData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching FinalData:', error);
      });
  }, [timeStamp]);

  // 转换AllData数据用于图表
  const chartData = allData.map(item => ({
    cacheName: item.cacheName,
    totalDuration: item.totalDuration,
    getsRPS: item.getsRPS,
    id: item.id,
  }));

  // 表格的列定义
  const columns = [
    {
      title: 'Cache Name',
      dataIndex: 'cacheName',
      key: 'cacheName',
    },
    {
      title: 'Total Duration',
      dataIndex: 'totalDuration',
      key: 'totalDuration',
    },
    {
      title: 'Gets RPS',
      dataIndex: 'getsRPS',
      key: 'getsRPS',
    },
    {
      title: 'Gets Average Latency',
      dataIndex: 'getsAverageLatency',
      key: 'getsAverageLatency',
    },
    {
      title: 'Gets P50',
      dataIndex: 'getsP50',
      key: 'getsP50',
    },
    {
      title: 'Gets P99',
      dataIndex: 'getsP99',
      key: 'getsP99',
    },
    {
      title: 'Gets P99 90',
      dataIndex: 'getsP99_90',
      key: 'getsP99_90',
    },
    {
      title: 'Gets P99 99',
      dataIndex: 'getsP99_99',
      key: 'getsP99_99',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* 折线图部分 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div style={{ padding: '10px', background: '#fff', borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <p><strong>Cache Name:</strong> {data.cacheName}</p>
                    <p><strong>Total Duration:</strong> {data.totalDuration}</p>
                    <p><strong>Gets RPS:</strong> {data.getsRPS}</p>
                    <p><strong>Gets Average Latency:</strong> {data.getsAverageLatency}</p>
                    <p><strong>Gets P50:</strong> {data.getsP50}</p>
                    <p><strong>Gets P99:</strong> {data.getsP99}</p>
                    <p><strong>Gets P99_90:</strong> {data.getsP99_90}</p>
                    <p><strong>Gets P99_99:</strong> {data.getsP99_99}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="getsRPS" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* 表格部分，使用Card布局竖向显示
      <h2>Final Data</h2>
      <Row gutter={16}>
        {finalData.map((data) => (
          <Col span={6} key={data.id}>
            <Card title={`ID: ${data.id}`} bordered={false}>
              <p><strong>Cache Name:</strong> {data.cacheName}</p>
              <p><strong>Total Duration:</strong> {data.totalDuration}</p>
              <p><strong>Gets RPS:</strong> {data.getsRPS}</p>
              <p><strong>Gets Average Latency:</strong> {data.getsAverageLatency}</p>
              <p><strong>Gets P50:</strong> {data.getsP50}</p>
              <p><strong>Gets P99:</strong> {data.getsP99}</p>
              <p><strong>Gets P99_90:</strong> {data.getsP99_90}</p>
              <p><strong>Gets P99_99:</strong> {data.getsP99_99}</p>
            </Card>
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default DataDisplayPage;
