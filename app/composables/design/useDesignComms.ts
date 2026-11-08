import type { DesignWorkspaceRole } from '~/utils/design/nav'

/**
 * Owner amendment (Phase 8): the messages and notifications surfaces keep the
 * real stores authoritative, but when a workspace inbox or feed is empty they
 * show clearly-labelled design sample data so the states can be demonstrated.
 * Sample ids and read state never touch the API stores.
 */
export type DesignCommsRole = DesignWorkspaceRole

export type DesignMessageThread = {
  id: string
  name: string
  role: string
  subject: string
  preview: string
  time: string
  unread: boolean
  body: string
  attachments: string[]
  actionLabel?: string
  actionUrl?: string
}

export type DesignNoticeTone = 'brand' | 'green' | 'amber'

export type DesignNotice = {
  id: string
  title: string
  body: string
  time: string
  tone: DesignNoticeTone
  unread: boolean
  group: string
  actionLabel?: string
  actionUrl?: string
}

const SAMPLE_THREADS: Record<DesignCommsRole, DesignMessageThread[]> = {
  client: [
    {
      id: 'sample-thread-client-1',
      name: 'Amara Wanjiru',
      role: 'Your manager',
      subject: 'Artwork approved — you are on the press schedule',
      preview: "Artwork approved — you're on the press schedule.",
      time: '09:12',
      unread: true,
      body: "Good morning Wanjiku,\n\nYour artwork for SAMPLE-1042 has been approved and the job is on the press schedule. The printshop starts the run today and you can follow every stage in the tracker.\n\nNo action is needed from you right now — I will message again when the job reaches quality check.",
      attachments: [],
      actionLabel: 'Track this job',
      actionUrl: '/track?code=SAMPLE-1042',
    },
    {
      id: 'sample-thread-client-2',
      name: 'Printy Support',
      role: 'Escrow desk',
      subject: 'Payment receipt for SAMPLE-1042',
      preview: 'Your payment receipt is attached to SAMPLE-1042.',
      time: 'Yesterday',
      unread: false,
      body: "Hi Wanjiku,\n\nYour payment for SAMPLE-1042 is safely held in escrow and the receipt is attached. Printy releases the printshop payout only after you confirm delivery.\n\nIf anything looks wrong, reply here and the escrow desk will help.",
      attachments: ['receipt-SAMPLE-1042.pdf'],
      actionLabel: 'Open the tracker',
      actionUrl: '/track?code=SAMPLE-1042',
    },
  ],
  partner: [
    {
      id: 'sample-thread-partner-1',
      name: 'Wanjiku Njeri',
      role: 'Client',
      subject: 'Delivery confirmed',
      preview: "Asante! I'll confirm delivery tomorrow morning.",
      time: '10:26',
      unread: true,
      body: "Asante for the update. The cards look great and I'll confirm delivery tomorrow morning once the team has checked the boxes.\n\nPlease keep SAMPLE-1042 on hold until then.",
      attachments: [],
      actionLabel: 'Open messages',
      actionUrl: '/app/messages',
    },
    {
      id: 'sample-thread-partner-2',
      name: 'Savanna Print Co.',
      role: 'Print shop',
      subject: 'Lamination done — sending to QC now',
      preview: 'Lamination done, sending to QC now.',
      time: '09:58',
      unread: false,
      body: "Lamination is complete on the SAMPLE-1042 run and the sheets are moving to quality check now.\n\nWe will flag immediately if the finishing window needs to move.",
      attachments: ['proof-SAMPLE-1042.jpg'],
      actionLabel: 'View job queue',
      actionUrl: '/app/manager#jobs',
    },
    {
      id: 'sample-thread-partner-3',
      name: 'Printy Ops',
      role: 'Admin',
      subject: 'Margin report is ready',
      preview: "This week's booked margin is available in the ledger.",
      time: '08:15',
      unread: false,
      body: "The weekly margin report is ready. Every band in the report is inside the server-enforced cap, so there is nothing for you to approve.\n\nOpen the manager ledger to review the breakdown.",
      attachments: [],
      actionLabel: 'Open rate bands',
      actionUrl: '/app/manager#rates',
    },
  ],
  production: [
    {
      id: 'sample-thread-production-1',
      name: 'Amara Wanjiru',
      role: 'Manager',
      subject: 'Finishing window confirmed',
      preview: 'Finishing window confirmed for the lamination run.',
      time: '11:02',
      unread: true,
      body: "The finishing window for SAMPLE-1042 is confirmed for this afternoon. The buyer has approved the artwork, so you can keep the line moving as planned.\n\nPlease mark each stage as it completes — the buyer tracker updates from your taps.",
      attachments: [],
      actionLabel: 'Open the job queue',
      actionUrl: '/app/printer#jobs',
    },
    {
      id: 'sample-thread-production-2',
      name: 'Printy Ops',
      role: 'Admin',
      subject: 'Payout releases after QC',
      preview: 'Payout releases after QC — keep the line updated.',
      time: '09:40',
      unread: false,
      body: "A reminder that the payout for SAMPLE-1042 releases automatically when quality check passes and delivery is confirmed. Keep the production stages current so the escrow desk can see the handoff.\n\nNo paperwork is needed from you.",
      attachments: [],
      actionLabel: 'Open the floor',
      actionUrl: '/app/printer',
    },
  ],
  super_admin: [
    {
      id: 'sample-thread-super-1',
      name: 'Amara Wanjiru',
      role: 'Manager',
      subject: 'Cap question on the banner job',
      preview: 'Cap question on the banner job — checked and fine.',
      time: '08:15',
      unread: false,
      body: "I checked the banner job against the server cap and the rate is inside the fair band. Nothing needs escalation from the admin side.\n\nThe job stays with the same printshop and the buyer has already funded escrow.",
      attachments: [],
    },
    {
      id: 'sample-thread-super-2',
      name: 'Savanna Print Co.',
      role: 'Print shop',
      subject: 'Rate card resubmitted',
      preview: 'Rate card resubmitted under the fair band.',
      time: 'Yesterday',
      unread: false,
      body: 'The updated rate card has been resubmitted and every row now sits under the review threshold. The shop is asking for a fresh look before the next manager match.',
      attachments: [],
      actionLabel: 'Open shops and managers',
      actionUrl: '/app/admin#network',
    },
  ],
}

const SAMPLE_NOTICES: Record<DesignCommsRole, DesignNotice[]> = {
  client: [
    {
      id: 'sample-notice-client-1',
      title: 'QC passed on SAMPLE-1042',
      body: 'Your lamination cleared quality check — delivery is next.',
      time: '12m ago',
      tone: 'brand',
      unread: true,
      group: 'Sample activity',
      actionLabel: 'Track job',
      actionUrl: '/track?code=SAMPLE-1042',
    },
    {
      id: 'sample-notice-client-2',
      title: 'Escrow received',
      body: 'Payment for SAMPLE-1042 is locked in escrow.',
      time: '1h ago',
      tone: 'green',
      unread: false,
      group: 'Sample activity',
      actionLabel: 'Track job',
      actionUrl: '/track?code=SAMPLE-1042',
    },
    {
      id: 'sample-notice-client-3',
      title: 'Price cap reminder',
      body: 'No manager can charge above the cap shown on your quote.',
      time: 'Yesterday',
      tone: 'amber',
      unread: false,
      group: 'Sample activity',
    },
  ],
  partner: [
    {
      id: 'sample-notice-partner-1',
      title: '3 quotes awaiting response',
      body: 'All pre-priced below the fair-price cap.',
      time: '9m ago',
      tone: 'amber',
      unread: true,
      group: 'Sample activity',
      actionLabel: 'Open quotes',
      actionUrl: '/app/manager#quotes',
    },
    {
      id: 'sample-notice-partner-2',
      title: 'SAMPLE-1042 moved to QC',
      body: 'Savanna Print advanced the line.',
      time: '40m ago',
      tone: 'brand',
      unread: false,
      group: 'Sample activity',
      actionLabel: 'Open jobs',
      actionUrl: '/app/manager#jobs',
    },
    {
      id: 'sample-notice-partner-3',
      title: 'Margin report ready',
      body: "This week's booked margin is available in the ledger.",
      time: '2h ago',
      tone: 'green',
      unread: false,
      group: 'Sample activity',
      actionLabel: 'Open rate bands',
      actionUrl: '/app/manager#rates',
    },
  ],
  production: [
    {
      id: 'sample-notice-production-1',
      title: 'New job in queue',
      body: 'SAMPLE-1042 laminated cards — finishing window in about 3h.',
      time: '18m ago',
      tone: 'brand',
      unread: true,
      group: 'Sample activity',
      actionLabel: 'Open queue',
      actionUrl: '/app/printer#jobs',
    },
    {
      id: 'sample-notice-production-2',
      title: 'Rate change approved',
      body: 'Flyers 500+ band approved under cap.',
      time: '1h ago',
      tone: 'green',
      unread: false,
      group: 'Sample activity',
      actionLabel: 'Open rate card',
      actionUrl: '/app/printer/rates',
    },
    {
      id: 'sample-notice-production-3',
      title: 'Escrow confirmed',
      body: 'SAMPLE-1042 is fully escrowed — start when ready.',
      time: '3h ago',
      tone: 'amber',
      unread: false,
      group: 'Sample activity',
      actionLabel: 'Open the floor',
      actionUrl: '/app/printer',
    },
  ],
  super_admin: [
    {
      id: 'sample-notice-super-1',
      title: 'Escrow float healthy',
      body: 'All live jobs fully funded; no variance.',
      time: '5m ago',
      tone: 'green',
      unread: true,
      group: 'Sample activity',
    },
    {
      id: 'sample-notice-super-2',
      title: 'Rate review pending',
      body: 'One shop rate sitting above review threshold.',
      time: '44m ago',
      tone: 'amber',
      unread: false,
      group: 'Sample activity',
      actionLabel: 'Open network',
      actionUrl: '/app/admin#network',
    },
    {
      id: 'sample-notice-super-3',
      title: 'Network sync complete',
      body: 'All dashboards match server state.',
      time: '1h ago',
      tone: 'brand',
      unread: false,
      group: 'Sample activity',
    },
  ],
}

const ROLES: DesignCommsRole[] = ['client', 'partner', 'production', 'super_admin']

export function useDesignComms() {
  const readSamples = useState<Record<string, boolean>>('design-sample-comms-read', () => ({}))

  function isRead(id: string): boolean {
    return Boolean(readSamples.value[id])
  }

  function sampleThreadsFor(role: DesignCommsRole | null | undefined): DesignMessageThread[] {
    const list = SAMPLE_THREADS[role ?? 'client'] ?? SAMPLE_THREADS.client
    return list.map((thread) => ({
      ...thread,
      unread: thread.unread && !isRead(thread.id),
    }))
  }

  function sampleNoticesFor(role: DesignCommsRole | null | undefined): DesignNotice[] {
    const list = SAMPLE_NOTICES[role ?? 'client'] ?? SAMPLE_NOTICES.client
    return list.map((notice) => ({
      ...notice,
      unread: notice.unread && !isRead(notice.id),
    }))
  }

  function findSampleNotice(id: string): DesignNotice | null {
    for (const role of ROLES) {
      const notice = SAMPLE_NOTICES[role].find((item) => item.id === id)
      if (notice) {
        return { ...notice, unread: notice.unread && !isRead(notice.id) }
      }
    }
    return null
  }

  function markSampleRead(id: string) {
    if (!id || isRead(id)) return
    readSamples.value = { ...readSamples.value, [id]: true }
  }

  function markAllSamplesRead(role: DesignCommsRole | null | undefined) {
    const next = { ...readSamples.value }
    for (const thread of SAMPLE_THREADS[role ?? 'client'] ?? SAMPLE_THREADS.client) {
      next[thread.id] = true
    }
    for (const notice of SAMPLE_NOTICES[role ?? 'client'] ?? SAMPLE_NOTICES.client) {
      next[notice.id] = true
    }
    readSamples.value = next
  }

  return {
    sampleThreadsFor,
    sampleNoticesFor,
    findSampleNotice,
    markSampleRead,
    markAllSamplesRead,
  }
}
