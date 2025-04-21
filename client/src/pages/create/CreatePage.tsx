import React from 'react'
import { IconChartLine } from '@tabler/icons-react'
import { IconHandClick } from '@tabler/icons-react'
import { IconAlt } from '@tabler/icons-react'
import { IconDeviceDesktopAnalytics } from '@tabler/icons-react'
import NavPage from '../../layout/NavPage'

// Link to the left navigation bar
const leftLinks = [
    { title: 'Manual', path: '/tests/man', icon: <IconHandClick stroke={2} /> },
    {
        title: 'BVT',
        path: '/tests/bvt',
        alert: 'Customers recommend manually creating the cache for bvt tests',
        icon: <IconDeviceDesktopAnalytics stroke={2} />,
    },
    {
        title: 'Performance',
        path: '/tests/perf',
        icon: <IconChartLine stroke={2} />,
        subLinks: [
            { title: 'Create', path: '/tests/perf', count: 1 },
            { title: 'InsertSingleTask', path: '/tests/benchmark', count: 2 },
            { title: 'Statistics', path: '/tests/statistics', count: 3 },
            { title: 'ExecutionTask', path: '/tests/routine', count: 4 },
            { title: 'Insertexcel', path: '/tests/TxtExcelMerger', count: 5 },
        ],
    },
    { title: 'ALT', path: '/tests/alt', icon: <IconAlt stroke={2} /> },
]

// Homepage component
const CreatePage: React.FC = () => {
    return <NavPage links={leftLinks} defaultPath="/tests/man" />
}

export default CreatePage
