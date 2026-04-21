export interface TeamMember {
    name: string;
    specialty: string;
    category: string;
    image: string;
    bio?: string;
}

export const doctors: TeamMember[] = [
    {
        name: 'Dr. Saroj Kumar Mandal',
        specialty: 'Senior Consultant Cardiologist',
        category: 'Cardiology',
        image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=1000',
        bio: 'Dr. Mandal is a leading expert in cardiovascular medicine with over 15 years of experience in interventional cardiology.'
    },
    {
        name: 'Dr. pankaj Pratap Shah',
        specialty: 'Head of Neurology Department',
        category: 'Neurology',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1528',
        bio: 'Dr. Shah specializes in complex neurological disorders and has published numerous research papers on stroke management.'
    },
    {
        name: 'Dr. Emily Williams',
        specialty: 'Consultant Pediatrician',
        category: 'Pediatrics',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=1374',
        bio: 'Dr. Williams is dedicated to providing compassionate care to children, with a focus on neonatology and child development.'
    },
    {
        name: 'Dr. Abhishek Shah',
        specialty: 'Senior Orthopedic Surgeon',
        category: 'Orthopedics',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1470',
        bio: 'Dr. Shah excels in joint replacement surgeries and sports medicine, helping patients regain their mobility and active lifestyle.'
    },
    {
        name: 'Dr. Suman Bhusal',
        specialty: 'Consultant Radiologist',
        category: 'Radio Imaging',
        image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1470',
        bio: 'Dr. Bhusal is an expert in diagnostic radiology with specialized training in MSK imaging and complex USG-guided procedures.'
    },
];

export const management = [
    {
        name: "Dr. Rajesh Kumar",
        role: "Managing Director",
        image: "/leadership/leader2.jpg",
        bio: "Specializing in health administration with over 20 years of clinical experience. He has been instrumental in growing the hospital from a small clinic to a multi-specialty regional healthcare leader. His vision focuses on patient-centric care and integrating modern technology into medical practices."
    },
    {
        name: "Ms. Anjali Sharma",
        role: "Administrative Head",
        image: "/leadership/leader1.png",
        bio: "Expert in hospital operations and strategic planning for healthcare growth. With a background in healthcare management from top institutions, Anjali ensures the daily operations run smoothly and efficiently, focusing on quality control and patient satisfaction."
    }
];
export const administrationTeam = [
    {
        name: 'Mr. Sameer Pathak',
        role: 'Chief Financial Officer',
        category: 'Finance',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1374',
        bio: 'Mr. Pathak manages the financial health of our institution, ensuring sustainable growth and resource optimization.'
    },
    {
        name: 'Ms. Priya Verma',
        role: 'Human Resources Manager',
        category: 'HR',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1376',
        bio: 'Ms. Verma leads our HR department, focusing on talent acquisition and building a supportive professional environment.'
    },
    {
        name: 'Mr. Arjun Thapa',
        role: 'Operations Coordinator',
        category: 'Operations',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1470',
        bio: 'Mr. Thapa oversees the daily logistical and operational functions to ensure seamless patient flow and facility management.'
    },
    {
        name: 'Ms. Sneha Rai',
        role: 'Patient Relations Lead',
        category: 'Relations',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1376',
        bio: 'Ms. Rai is dedicated to enhancing the patient experience and maintaining high standards of service excellence.'
    }
];
