'use client';

import { useState, useEffect } from 'react';
import UserToolsTable from '@/components/UserToolsTable';

export default function UserToolsPage() {
  const [userTools, setUserTools] = useState([]);
  const [searchTerms, setSearchTerms] = useState({ team: '', user: '', tool: '', client: '' });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/user-tools');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setUserTools(data);
      } catch (error) {
        console.error('Error fetching user tools:', error);
      }
    }
    fetchData();
  }, []);

  return <UserToolsTable data={userTools} searchTerms={searchTerms} setSearchTerms={setSearchTerms} />;
}
