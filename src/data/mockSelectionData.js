export const SELECTION_STATUS = {
  NEED_PEERS: 'need_peers',
  WAITING_LECTURER: 'waiting_lecturer',
  PRADITA_IN_PROGRESS: 'pradita_in_progress',
  PRADITA_COMPLETED: 'pradita_completed',
  FINAL_ANNOUNCED: 'final_announced',
}

export const REVIEW_STATUS = {
  INVITED: 'invited',
  READY: 'ready',
  WAITING: 'waiting',
  COMPLETED: 'completed',
}

const mockSelectionData = {
  status: SELECTION_STATUS.WAITING_LECTURER,

  student: {
    name: 'Allegra Aretha Putri',
    nim: '2410102004',
    angkatan: '2024',
    email: 'allegra@student.pradita.ac.id',
    ipk: 3.88,
    skpi: 250,
  },

  tahap1: {
    status: 'passed',
    rank: 2,
    score: 86.4,

    prestasi: {
      submitted: true,
      name: 'WEBSITEEKONOMIS',
      level: 'nasional',
      verificationStatus: 'verified',
    },

    organisasi: {
      submitted: true,
      name: 'HIMSI',
      level: 'lokal',
      position: 'anggota',
      verificationStatus: 'verified',
    },

    bahasaAsing: {
      submitted: false,
      language: null,
      certificate: null,
      score: null,
      verificationStatus: null,
    },
  },

  reviewers: {
    peers: [
      {
        id: 1,
        email: 'rekan.satu@student.pradita.ac.id',
        invitationStatus: REVIEW_STATUS.INVITED,
        reviewStatus: REVIEW_STATUS.WAITING,
      },
      {
        id: 2,
        email: 'rekan.dua@student.pradita.ac.id',
        invitationStatus: REVIEW_STATUS.INVITED,
        reviewStatus: REVIEW_STATUS.WAITING,
      },
      {
        id: 3,
        email: 'rekan.tiga@student.pradita.ac.id',
        invitationStatus: REVIEW_STATUS.INVITED,
        reviewStatus: REVIEW_STATUS.WAITING,
      },
    ],

    kaprodi: {
      id: 'kaprodi-si',
      name: 'Kaprodi Sistem Informasi',
      status: REVIEW_STATUS.READY,
      reviewStatus: REVIEW_STATUS.WAITING,
    },

    lecturer: {
      id: null,
      name: null,
      status: REVIEW_STATUS.WAITING,
      reviewStatus: null,
    },

    progress: {
      completed: 0,
      total: 5,
    },
  },

  praditaValue: {
    score: null,
  },

  finalResult: {
    announced: false,
    rank: null,
    tahap1Score: null,
    praditaValueScore: null,
    finalScore: null,
  },
}

export default mockSelectionData