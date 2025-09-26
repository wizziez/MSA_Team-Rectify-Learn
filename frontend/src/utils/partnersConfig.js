// Dynamic Partners Configuration
// This file manages all strategic partnerships and their display logic

export const PARTNER_CATEGORIES = {
  STARTUP_PROGRAMS: 'startup_programs',
  TECH_PARTNERS: 'tech_partners',
  EDUCATIONAL: 'educational',
  INVESTORS: 'investors',
  ENTERPRISE: 'enterprise'
};

export const PARTNERS_DATA = {
  [PARTNER_CATEGORIES.STARTUP_PROGRAMS]: [
    {
      id: 'microsoft_startups',
      name: 'Microsoft for Startups',
      category: PARTNER_CATEGORIES.STARTUP_PROGRAMS,
      logo: {
        type: 'svg',
        content: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
        `
      },
      description: 'Access to Azure credits, technical support, and go-to-market resources',
      benefits: ['$150k Azure credits', 'Technical mentorship', 'Co-sell opportunities'],
      priority: 1,
      active: true
    },
    {
      id: 'github_startups',
      name: 'GitHub for Startups',
      category: PARTNER_CATEGORIES.STARTUP_PROGRAMS,
      logo: {
        type: 'svg',
        content: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        `
      },      description: 'Enterprise GitHub access and developer tools',
      benefits: ['GitHub Enterprise', 'Copilot access', 'Developer community'],
      priority: 2,
      active: true
    },
    {
      id: 'aws_startups',
      name: 'AWS for Startups',
      category: PARTNER_CATEGORIES.STARTUP_PROGRAMS,
      logo: {
        type: 'svg',
        content: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.763 10.648c0 .535.069 .972.19 1.31.138.34.328.639.588.911l.602.602c.139.138.19.259.19.363 0 .103-.069.224-.19.328l-.655.518c-.103.07-.207.103-.31.103-.138 0-.276-.069-.397-.19-.259-.276-.466-.569-.639-.898-.174-.328-.259-.69-.259-1.1 0-.535.121-.992.363-1.379.241-.386.588-.69 1.017-.897.431-.224.932-.328 1.517-.328.586 0 1.086.104 1.517.328.429.207.776.511 1.017.897.242.387.363.844.363 1.379 0 .41-.086.772-.259 1.1-.173.329-.38.622-.639.898-.121.121-.259.19-.397.19-.103 0-.207-.034-.31-.103l-.655-.518c-.121-.104-.19-.225-.19-.328 0-.104.051-.225.19-.363l.602-.602c.26-.272.45-.571.588-.911.121-.338.19-.775.19-1.31 0-.535-.086-.992-.276-1.379-.19-.386-.466-.672-.81-.846-.345-.19-.759-.276-1.241-.276-.483 0-.897.086-1.242.276-.344.174-.62.46-.81.846-.19.387-.276.844-.276 1.379z"/>
            <path d="M17.917 13.111c-.932 0-1.724-.328-2.379-.984-.655-.656-.983-1.448-.983-2.38 0-.931.328-1.723.983-2.378.655-.656 1.447-.984 2.379-.984s1.724.328 2.379.984c.655.655.984 1.447.984 2.378 0 .932-.329 1.724-.984 2.38-.655.656-1.447.984-2.379.984zm0-5.794c-.655 0-1.207.225-1.655.673-.448.448-.673 1-.673 1.655s.225 1.207.673 1.655c.448.448 1 .673 1.655.673s1.207-.225 1.655-.673c.448-.448.673-1 .673-1.655s-.225-1.207-.673-1.655c-.448-.448-1-.673-1.655-.673z"/>
          </svg>
        `
      },
      description: 'Cloud infrastructure credits and technical support',
      benefits: ['$100k AWS credits', 'Technical workshops', 'Startup network'],
      priority: 4,
      active: false
    }
  ],
  [PARTNER_CATEGORIES.TECH_PARTNERS]: [
    {
      id: 'openai',
      name: 'OpenAI',
      category: PARTNER_CATEGORIES.TECH_PARTNERS,
      logo: {
        type: 'svg',
        content: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zm-2.4423-16.0389a4.4748 4.4748 0 0 1 2.3445-1.9728V6.3312a.7724.7724 0 0 0 .3927.6813l5.8144 3.3538-2.0201 1.1685a.0757.0757 0 0 1-.071 0L2.7765 8.8425a4.4992 4.4992 0 0 1 .6612-6.1599zm16.5563 3.8558L18.4935 8.2396l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7985a4.4992 4.4992 0 0 1-.6599 8.0696v-5.5826a.7724.7724 0 0 0-.3927-.6813z"/>
          </svg>
        `
      },
      description: 'Advanced AI model integration and API access',
      benefits: ['GPT-4 API access', 'Priority support', 'Beta features'],
      priority: 1,
      active: false
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      category: PARTNER_CATEGORIES.TECH_PARTNERS,
      logo: {
        type: 'text',
        content: 'Anthropic'
      },
      description: 'Claude AI model integration for enhanced learning',
      benefits: ['Claude API access', 'Custom model training', 'Research collaboration'],
      priority: 2,
      active: false
    }
  ],

  [PARTNER_CATEGORIES.EDUCATIONAL]: [
    {
      id: 'coursera',
      name: 'Coursera',
      category: PARTNER_CATEGORIES.EDUCATIONAL,
      logo: {
        type: 'text',
        content: 'Coursera'
      },
      description: 'Educational content partnership',
      benefits: ['Course integration', 'Certification tracking', 'Learning analytics'],
      priority: 1,
      active: false // Example of inactive partner
    }
  ],

  [PARTNER_CATEGORIES.ENTERPRISE]: [
    {
      id: 'google_cloud',
      name: 'Google Cloud',
      category: PARTNER_CATEGORIES.ENTERPRISE,
      logo: {
        type: 'svg',
        content: `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 3.11h-.48L12 2.38l.24.73zm7.17 18.89s-2.77-3.15-7.41-8.81c-4.64-5.66-7.41-8.81-7.41-8.81L12 2.38l7.41 10.89s-2.77 3.15-7.41 8.81z"/>
          </svg>
        `
      },
      description: 'Cloud infrastructure and enterprise solutions',
      benefits: ['GCP credits', 'Enterprise support', 'AI/ML tools'],
      priority: 2,
      active: true
    }
  ]
};

// Dynamic display configurations
export const DISPLAY_CONFIGS = {
  LANDING_PAGE: {
    maxVisible: 3,
    rotationInterval: 8000, // 8 seconds
    categories: [PARTNER_CATEGORIES.STARTUP_PROGRAMS, PARTNER_CATEGORIES.TECH_PARTNERS],
    prioritizeActive: true,
    animationDelay: 5000 // 5 seconds between animations
  },
    SPLASH_SCREEN: {
    maxVisible: 3,
    rotationInterval: 6000, // 6 seconds
    categories: [PARTNER_CATEGORIES.STARTUP_PROGRAMS],
    prioritizeActive: true,
    animationDelay: 3000 // 3 seconds between animations
  },
  
  FOOTER: {
    maxVisible: 5,
    rotationInterval: 0, // No rotation
    categories: Object.values(PARTNER_CATEGORIES),
    prioritizeActive: true,
    animationDelay: 0
  }
};

// Utility functions for dynamic partner management
export class PartnerManager {
  static getActivePartners(categories = Object.values(PARTNER_CATEGORIES)) {
    const partners = [];
    categories.forEach(category => {
      if (PARTNERS_DATA[category]) {
        partners.push(...PARTNERS_DATA[category].filter(partner => partner.active));
      }
    });
    return partners.sort((a, b) => a.priority - b.priority);
  }

  static getPartnersForDisplay(config) {
    const activePartners = this.getActivePartners(config.categories);
    
    if (config.maxVisible >= activePartners.length) {
      return activePartners;
    }

    // Return top priority partners up to maxVisible limit
    return activePartners.slice(0, config.maxVisible);
  }

  static getRotatingPartners(config) {
    const allPartners = this.getActivePartners(config.categories);
    const visibleCount = Math.min(config.maxVisible, allPartners.length);
    
    // If we have more partners than can be displayed, create rotation groups
    if (allPartners.length > visibleCount) {
      const groups = [];
      for (let i = 0; i < allPartners.length; i += visibleCount) {
        groups.push(allPartners.slice(i, i + visibleCount));
      }
      return groups;
    }
    
    return [allPartners];
  }

  static addPartner(partner) {
    const category = partner.category;
    if (!PARTNERS_DATA[category]) {
      PARTNERS_DATA[category] = [];
    }
    PARTNERS_DATA[category].push(partner);
  }

  static updatePartnerStatus(partnerId, active) {
    Object.values(PARTNERS_DATA).forEach(categoryPartners => {
      const partner = categoryPartners.find(p => p.id === partnerId);
      if (partner) {
        partner.active = active;
      }
    });
  }

  static getPartnersByCategory(category) {
    return PARTNERS_DATA[category] || [];
  }

  static searchPartners(query) {
    const results = [];
    Object.values(PARTNERS_DATA).forEach(categoryPartners => {
      categoryPartners.forEach(partner => {
        if (partner.name.toLowerCase().includes(query.toLowerCase()) ||
            partner.description.toLowerCase().includes(query.toLowerCase())) {
          results.push(partner);
        }
      });
    });
    return results;
  }
}

export default {
  PARTNER_CATEGORIES,
  PARTNERS_DATA,
  DISPLAY_CONFIGS,
  PartnerManager
};
