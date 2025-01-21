import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import './Dashboard.css';

const { Title } = Typography;

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
  timeStamp: string;
  id: number;
}

const DataDisplayPage: React.FC = () => {
  const { timeStamp } = useParams<{ timeStamp: string }>();
  const [allData, setAllData] = useState<AllData[]>([]);
  const [middleData, setMiddleData] = useState<AllData | null>(null);

  useEffect(() => {
    if (!timeStamp) {
      console.error('Timestamp is undefined!');
      return;
    }
    // 获取 AllData 数据
    axios
      .get(`https://localhost:7179/api/Data/AllData?TimeStamp=${timeStamp}`)
      .then((response) => {
        const data = response.data;
        setAllData(data);

        // 取中间值
        const middleIndex = Math.floor(data.length / 2);
        const selectedData = data[middleIndex];
        setMiddleData(selectedData);
      })
      .catch((error) => {
        console.error('Error fetching AllData:', error);
      });
  }, [timeStamp]);

  // 转换 AllData 数据用于图表
  const chartData = allData.map((item,index) => ({
    index: index + 1, 
    cacheName: item.cacheName,
    totalDuration: item.totalDuration,
    getsRPS: Math.round(item.getsRPS / 1000), 
    timeUnit: item.timeUnit,
    id: item.id,
    AverageLatency: item.getsAverageLatency,
    GetsP50: item.getsP50,
    GetsP99: item.getsP99,
    GetsP99_90: item.getsP99_90,
    GetsP99_99: item.getsP99_99,
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
    <div style={{ padding: '10px', textAlign: 'center' }}>
      {/* 标题 */}
      <Title level={2} style={{ marginBottom: '20px' }}>
        Data Visualization
      </Title>

      {/* 折线图部分 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
         {/* 图表标题 */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="index"
              label={{ value: 'Times', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Ops (K)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `${value}K`}
            />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div
                      style={{
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '5px',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <p><strong>Cache Name:</strong> {data.cacheName}</p>
                      <p><strong>Total Duration:</strong> {data.totalDuration}</p>
                      <p><strong>TimeUnit:</strong> {data.timeUnit}</p>
                      <p><strong>Gets RPS:</strong> {data.getsRPS}K</p>
                      <p><strong>Gets Average Latency:</strong> {data.AverageLatency}</p>
                      <p><strong>Gets P50:</strong> {data.GetsP50}</p>
                      <p><strong>Gets P99:</strong> {data.GetsP99}</p>
                      <p><strong>Gets P99_90:</strong> {data.GetsP99_90}</p>
                      <p><strong>Gets P99_99:</strong> {data.GetsP99_99}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
            verticalAlign="top"
            formatter={() => 'cacheName'}
            />
            <Line type="monotone" dataKey="getsRPS" stroke="#82ca9d" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

{/* 表格部分 */}
{middleData && (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        width: '1000%',
        maxWidth: '1200px',
      }}
    >
      <h3
        style={{
          marginBottom: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#333',
          fontSize: '1.5rem',
        }}
      >
        Final Data
      </h3>
      <Table
        dataSource={[middleData]}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered={false}
        scroll={{ x: 1000 }} // 允许水平滚动，适应多列情况
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataDisplayPage;
