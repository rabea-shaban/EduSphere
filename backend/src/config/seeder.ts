import Grade from '../modules/grades/grade.model';
import Term from '../modules/terms/term.model';

/**
 * Auto-seeds default Grades (Grade 4-12) and Terms (First/Second) if collections are empty.
 */
export const seedDefaultData = async (): Promise<void> => {
  try {
    // 1. Seed Grades
    const gradeCount = await Grade.countDocuments();
    if (gradeCount === 0) {
      console.log('[Seeder] Grades collection is empty. Seeding default grades...');
      const defaultGrades = [
        {
          name: { ar: 'الصف الرابع الابتدائي', en: 'Grade 4' },
          order: 4,
          educationStage: 'Primary',
          description: 'Fourth Grade of Primary School',
        },
        {
          name: { ar: 'الصف الخامس الابتدائي', en: 'Grade 5' },
          order: 5,
          educationStage: 'Primary',
          description: 'Fifth Grade of Primary School',
        },
        {
          name: { ar: 'الصف السادس الابتدائي', en: 'Grade 6' },
          order: 6,
          educationStage: 'Primary',
          description: 'Sixth Grade of Primary School',
        },
        {
          name: { ar: 'الصف الأول الإعدادي', en: 'Grade 7' },
          order: 7,
          educationStage: 'Preparatory',
          description: 'First Grade of Preparatory School',
        },
        {
          name: { ar: 'الصف الثاني الإعدادي', en: 'Grade 8' },
          order: 8,
          educationStage: 'Preparatory',
          description: 'Second Grade of Preparatory School',
        },
        {
          name: { ar: 'الصف الثالث الإعدادي', en: 'Grade 9' },
          order: 9,
          educationStage: 'Preparatory',
          description: 'Third Grade of Preparatory School',
        },
        {
          name: { ar: 'الصف الأول الثانوي', en: 'Grade 10' },
          order: 10,
          educationStage: 'Secondary',
          description: 'First Grade of Secondary School',
        },
        {
          name: { ar: 'الصف الثاني الثانوي', en: 'Grade 11' },
          order: 11,
          educationStage: 'Secondary',
          description: 'Second Grade of Secondary School',
        },
        {
          name: { ar: 'الصف الثالث الثانوي', en: 'Grade 12' },
          order: 12,
          educationStage: 'Secondary',
          description: 'Third Grade of Secondary School',
        },
      ];
      await Grade.insertMany(defaultGrades);
      console.log('[Seeder] Grades seeded successfully.');
    } else {
      console.log('[Seeder] Grades collection already has data. Skipping grades seeding.');
    }

    // 2. Seed Terms
    const termCount = await Term.countDocuments();
    if (termCount === 0) {
      console.log('[Seeder] Terms collection is empty. Seeding default terms...');
      const defaultTerms = [
        { name: 'First Term', order: 1, isActive: true },
        { name: 'Second Term', order: 2, isActive: true },
      ];
      await Term.insertMany(defaultTerms);
      console.log('[Seeder] Terms seeded successfully.');
    } else {
      console.log('[Seeder] Terms collection already has data. Skipping terms seeding.');
    }
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error);
  }
};
