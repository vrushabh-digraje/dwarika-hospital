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
