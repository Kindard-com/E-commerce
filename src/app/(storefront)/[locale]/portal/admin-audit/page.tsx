"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/storefront/lib/StoreContext';

export default function AuditLogsPage() {
  const { isAdmin, authLoading } = useStore();
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/portal');
      return;
    }
    if (isAdmin) {
      fetch('/api/admin/audit')
        .then(res => res.json())
        .then(data => {
          setLogs(data.logs || []);
          setLoading(false);
        });
    }
  }, [isAdmin, authLoading, router]);

  if (authLoading || !isAdmin) return <div>Checking access...</div>;
  if (loading) return <div>Loading audit logs...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', textTransform: 'uppercase', marginBottom: '24px' }}>Audit Logs</h1>
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--black)', boxShadow: '4px 4px 0 var(--black)', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--light)', borderBottom: '1.5px solid var(--black)' }}>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Admin</th>
              <th style={{ padding: '12px' }}>Action</th>
              <th style={{ padding: '12px' }}>Key</th>
              <th style={{ padding: '12px' }}>Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--light)' }}>
                <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(log.created_at).toLocaleString()}</td>
                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{log.admin_number}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{log.action}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{log.setting_key || '-'}</td>
                <td style={{ padding: '12px', fontSize: '12px', color: 'var(--mid)' }}>
                  <div style={{ textDecoration: 'line-through' }}>{log.old_value}</div>
                  <div style={{ color: 'var(--green)' }}>{log.new_value}</div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--mid)' }}>No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
