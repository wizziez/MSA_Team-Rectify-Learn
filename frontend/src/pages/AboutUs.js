import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaLinkedin
} from 'react-icons/fa';

// Color scheme matching the app theme
const colors = {
  blurple: '#5865F2',
  green: '#57F287',
  yellow: '#FEE75C',
  fuchsia: '#EB459E',
  red: '#ED4245',
  white: '#FFFFFF',
  black: '#23272A',
  darkButNotBlack: '#2C2F33',
  notQuiteBlack: '#23272A',
  greyple: '#99AAB5',
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background: #2C2F33;
  color: #ffffff;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 2rem 0;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff !important;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #ffffff !important;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MissionSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 4rem;
`;

const MissionCard = styled(motion.div)`
  background: #36393F;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #5865F2 0%, #7289DA 100%);
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const MissionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff !important;
`;

const MissionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #ffffff !important;
  margin-bottom: 2rem;
`;

const Motto = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #3B4CCA;
  font-style: italic;
  text-align: center;
  opacity: 0.9;
`;

const TimelineSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 4rem;
`;

const TimelineTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #ffffff !important;
`;

const TimelineContainer = styled.div`
  position: relative;
  padding: 2rem 0;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #5865F2 0%, #7289DA 50%, #3B4CCA 100%);
    transform: translateX(-50%);
    border-radius: 2px;
    
    @media (max-width: 768px) {
      left: 30px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    
    .timeline-content {
      text-align: right;
      margin-right: 2rem;
      margin-left: 0;
    }
    
    @media (max-width: 768px) {
      flex-direction: row;
      
      .timeline-content {
        text-align: left;
        margin-left: 2rem;
        margin-right: 0;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const TimelineMarker = styled.div`
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 20px rgba(88, 101, 242, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(88, 101, 242, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    left: 30px;
    transform: translateX(-50%);
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  max-width: 45%;
  margin-left: 2rem;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 2rem;
  }
`;

const TimelineCard = styled(motion.div)`
  background: #36393F;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.accentColor || 'linear-gradient(90deg, #5865F2 0%, #7289DA 100%)'};
  }
`;

const TimelineDate = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #5865F2;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TimelineItemTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff !important;
  margin-bottom: 1rem;
`;

const TimelineDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #ffffff !important;
  margin-bottom: 1rem;
`;

const TimelineAchievements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #ffffff !important;
    position: relative;
    padding-left: 1rem;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #5865F2;
      font-weight: bold;
    }
    
    a {
      color: #5865F2;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        color: #ffffff;
        text-decoration: underline;
      }
    }
  }
`;

const TeamSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TeamTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #ffffff !important;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const TeamCard = styled(motion.div)`
  background: #36393F;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.accentColor || 'linear-gradient(90deg, #5865F2 0%, #7289DA 100%)'};
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border: 4px solid #5865F2;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Name = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #ffffff !important;
`;

const Role = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #5865F2 !important;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #ffffff !important;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Ismail Hossain Ariyan",
      role: "CEO",
      description: "Spearheads the company's strategic vision and drives high-impact decisions to shape the future of EdTech.",
      image: "/photos/ismail-ariyan.jpg",
      linkedin: "https://www.linkedin.com/in/ismailariyan/",
      accentColor: "linear-gradient(135deg, #6C4DFF 0%, #3B4CCA 100%)"
    },
    {
      name: "Raiyan Sarwar",
      role: "COO",
      description: "Orchestrates operational strategy and organizational foresight—bridging long-term vision with seamless execution to foster scalable impact and cross-functional synergy.",
      image: "/photos/raiyan.jpg",
      linkedin: "https://www.linkedin.com/in/raiyanbsarwar/",
      accentColor: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
    },
    {
      name: "Al Hadi Elaf",
      role: "CTO",
      description: "Architects the core technological framework, ensuring innovation, performance, and sustainability in our AI solutions.",
      image: "/photos/al-hadi-elaf.png",
      linkedin: "https://www.linkedin.com/in/alhadi-elaf/",
      accentColor: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const timelineData = [
    {
      date: "Mid 2024",
      title: "Ideation Phase",
      description: "The spark of innovation began as we identified the need for personalized, AI-driven educational tools.",
      achievements: [
        "Market research and problem identification",
        "Initial concept development",
        "Team formation and vision alignment"
      ],
      accentColor: "linear-gradient(90deg, #5865F2 0%, #7289DA 100%)"
    },
    {
      date: "Late 2024",
      title: "Execution & Development",
      description: "From concept to reality - we dove deep into development while participating in AI projects that shaped our approach.",
      achievements: [
        "Small-scale execution and MVP development",
        "Participation in notable AI projects",
        "Recognition at demo day submissions",
        "Core technology stack establishment"
      ],
      accentColor: "linear-gradient(90deg, #57F287 0%, #3ba55c 100%)"
    },
    {
      date: "May 2025",
      title: "Pilot Launch & Recognition",
      description: "Version 1.0 launched with incredible recognition from industry leaders and media outlets.",
      achievements: [
        "Pilot version 1.0 successful launch",
        <span>Featured recognition from <a href="https://www.thedailystar.net/tech-startup/news/student-led-edtech-joins-four-global-startup-hubs-3906436" target="_blank" rel="noopener noreferrer">The Daily Star</a></span>,
        <span><a href="https://x.com/MSFTImagine/status/1930289691808485824" target="_blank" rel="noopener noreferrer">Microsoft</a> partnership acknowledgment</span>,
        <span><a href="https://x.com/GitHubEducation/status/1928495539697455340" target="_blank" rel="noopener noreferrer">GitHub</a> community recognition</span>,
        "Growing user base and positive feedback"
      ],
      accentColor: "linear-gradient(90deg, #FEE75C 0%, #f1c40f 100%)"
    },
    {
      date: "Present",
      title: "The Journey Continues",
      description: "With strong foundations and industry recognition, we're scaling to revolutionize education globally.",
      achievements: [
        "Continuous product enhancement",
        "Expanding team and capabilities",
        "Building strategic partnerships",
        "Preparing for next-phase growth"
      ],
      accentColor: "linear-gradient(90deg, #EB459E 0%, #c73e8a 100%)"
    }
  ];

  return (
    <Container>
      <Header>
        <Title
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          About Us
        </Title>
        <Subtitle
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          We're on a mission to revolutionize education through cutting-edge AI technology, 
          empowering students and educators worldwide to achieve unprecedented learning outcomes.
        </Subtitle>
      </Header>

      <MissionSection>
        <MissionCard
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <MissionTitle>Our Mission</MissionTitle>
          <MissionText>
            To democratize quality education by leveraging artificial intelligence to create personalized, 
            engaging, and effective learning experiences that adapt to each student's unique needs and learning style. 
            We believe that every student deserves access to world-class educational tools that can unlock their full potential.
          </MissionText>
          <Motto>
            "Master More, Forget Less, Learn Intelligently"
          </Motto>
        </MissionCard>
      </MissionSection>

      <TimelineSection>
        <TimelineTitle
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our Journey
        </TimelineTitle>
        
        <TimelineContainer>
          {timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
            >
              <TimelineMarker />
              <TimelineContent className="timeline-content">
                <TimelineCard
                  accentColor={item.accentColor}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <TimelineDate>{item.date}</TimelineDate>
                  <TimelineItemTitle>{item.title}</TimelineItemTitle>
                  <TimelineDescription>{item.description}</TimelineDescription>
                  <TimelineAchievements>
                    {item.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex}>{achievement}</li>
                    ))}
                  </TimelineAchievements>
                </TimelineCard>
              </TimelineContent>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </TimelineSection>

      <TeamSection>
        <TeamTitle
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Meet Our Team
        </TeamTitle>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamCard
                key={index}
                variants={itemVariants}
                accentColor={member.accentColor}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileImage src={member.image} />
                <Name>{member.name}</Name>
                <Role>
                  {member.role}
                </Role>
                <Description>{member.description}</Description>
                <SocialLinks>
                  <SocialLink href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedin />
                  </SocialLink>
                </SocialLinks>
              </TeamCard>
            ))}
          </TeamGrid>
        </motion.div>
      </TeamSection>
    </Container>
  );
};

export default AboutUs;
