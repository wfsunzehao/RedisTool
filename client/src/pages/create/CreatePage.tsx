import React from 'react'
import { IconChartLine } from '@tabler/icons-react'
import { IconHandClick } from '@tabler/icons-react'
import { IconAlt } from '@tabler/icons-react'
import { IconDeviceDesktopAnalytics } from '@tabler/icons-react'
import NavPage from '../../layout/NavPage'

// 左侧导航栏的链接
const leftLinks = [
    { title: 'Manual', path: '/create/man', icon: <IconHandClick stroke={2} /> },
    { title: 'BVT', path: '/create/bvt', icon: <IconDeviceDesktopAnalytics stroke={2} /> },
    {
        title: 'Performance',
        path: '/create/perf',
        icon: <IconChartLine stroke={2} />,
        subLinks: [
            { title: 'Create', path: '/create/perf' },
            { title: 'Benchmark', path: '/create/benchmark' },
            { title: 'Statistics', path: '/create/statistics' },
        ],
    },
    { title: 'ALT', path: '/create/alt', icon: <IconAlt stroke={2} /> },
]

// 主页面组件
const CreatePage: React.FC = () => {
    return (
        <NavPage
            links={leftLinks}
            defaultPath="/create/man"
            alertMessage="Customers recommend manually creating the cache for bvt tests"
        />
    )
}

export default CreatePage
