from pathlib import Path

base = Path('printy_ui')
files = [
    'app/components/workbench/views/BuyerView.vue',
    'app/components/workbench/views/ManagerView.vue',
    'app/components/workbench/views/PrinterView.vue',
    'app/components/workbench/views/HomeView.vue',
    'app/components/workbench/ClientJobsPanel.vue',
    'app/components/workbench/views/JobCard.vue',
    'app/components/workbench/Tracker/BuyerJobsInProgress.vue',
    'app/components/workbench/Tracker/TicketStepper.vue',
    'app/components/workbench/Tracker/TrackTicket.vue',
    'app/components/workbench/views/TrackView.vue',
    'tests/unit/buyer-tracker.test.ts',
    'tests/unit/client-jobs-panel.test.ts',
    'tests/unit/printer-view.test.ts',
    'tests/unit/homepage-demo.test.ts',
]
for p in files:
    t = base / p
    print('\n### %s (%d bytes)' % (p, t.stat().st_size))
    print(t.read_bytes().decode('utf-8', 'replace'))
