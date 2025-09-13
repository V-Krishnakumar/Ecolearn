// Video mapping for each lesson module
export const videoMap = {
  1: '/videos/Waste Management.mp4',        // Waste Management
  2: '/videos/Water Treatment.mp4',         // Water Treatment
  3: '/videos/Pollution - Free Zones.mp4',  // Pollution Free
  4: '/videos/Afforestation.mp4',           // Afforestation
  5: '/videos/Deforestation.mp4',           // Deforestation
  6: '/videos/Renewable Energy.mp4'         // Renewable Energy
} as const;

export type LessonId = keyof typeof videoMap;

export function getVideoSrc(lessonId: number): string | null {
  return videoMap[lessonId as LessonId] || null;
}

export function hasVideo(lessonId: number): boolean {
  return lessonId in videoMap;
}
