import HeroSection from '@/components/home/HeroSection'
import AnnualThemeSection from '@/components/home/AnnualThemeSection'
import QuickLinks from '@/components/home/QuickLinks'
import AnnouncementSection from '@/components/home/AnnouncementSection'
import VisionSection from '@/components/home/VisionSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AnnualThemeSection />
      <QuickLinks />
      <AnnouncementSection />
      <VisionSection />
    </main>
  )
}
