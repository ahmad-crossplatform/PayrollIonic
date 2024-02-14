
import { atom } from 'jotai';
export interface IPayslip {
    fromName: string;
    subject: string;
    fromDate: Date;
    toDate: Date;
    id: number;
    isNew?: boolean;
    file?: string; // URL t// URL to the PDF or image
}

export const payslipAtom = atom<IPayslip[]>([

    {
        isNew: true,
        fromName: 'Matt Chorsey',

        subject: 'New event: Trip to Vegas',
        fromDate: new Date('2021-08-01'),
        toDate: new Date('2021-08-31'),
        id: 0,
        file: 'https://images.dog.ceo/breeds/spaniel-blenheim/n02086646_4213.jpg'
    },
    {

        fromName: 'Lauren Ruthford',
        subject: 'Long time no chat',
        fromDate: new Date('2021-09-01'),
        toDate: new Date('2021-09-30'),

        id: 1,
        file: 'https://images.dog.ceo/breeds/vizsla/n02100583_12394.jpg',
    },
    {
        isNew: true,
        fromName: 'Jordan Firth',
        subject: 'Report Results',
        fromDate: new Date('2021-10-01'),
        toDate: new Date('2021-10-31'),
        id: 2,
        file: 'https://images.dog.ceo/breeds/akita/Akita_hiking_in_Shpella_e_Pellumbasit.jpg',
    },
    {
        isNew: true,
        fromName: 'Bill Thomas',
        subject: 'The situation',
        fromDate: new Date('2021-11-01'),
        toDate: new Date('2021-11-30'),
        id: 3,
        file: 'https://images.dog.ceo/breeds/spaniel-welsh/n02102177_2405.jpg',
    },
    {
        fromName: 'Joanne Pollan',
        subject: 'Updated invitation: Swim lessons',
        fromDate: new Date('2021-12-01'),
        toDate: new Date('2021-12-31'),
        id: 4,
        file: 'https://images.dog.ceo/breeds/spaniel-blenheim/n02086646_4213.jpg'

    },
    {
        fromName: 'Andrea Cornerston',
        subject: 'Last minute ask',
        fromDate: new Date('2022-01-01'),
        toDate: new Date('2022-01-31'),
        id: 5,
        file: 'https://images.dog.ceo/breeds/komondor/n02105505_4260.jpg"'
    },
    {
        fromName: 'Moe Chamont',
        subject: 'Family Calendar - Version 1',
        fromDate: new Date('2022-02-01'),
        toDate: new Date('2022-02-28'),
        id: 6,
        file: 'https://images.dog.ceo/breeds/pyrenees/n02111500_3254.jpg'
    },
    {
        isNew: true,
        fromName: 'Kelly Richardson',
        subject: 'Placeholder Headhots',
        fromDate: new Date('2022-03-01'),
        toDate: new Date('2022-03-31'),
        id: 7,
        file: 'https://images.dog.ceo/breeds/husky/n02110185_7413.jpg'
    },


]);
