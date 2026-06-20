import HeroSection from '@/components/home/HeroSection'
import QuickLinks from '@/components/home/QuickLinks'
import AnnouncementSection from '@/components/home/AnnouncementSection'
import VisionSection from '@/components/home/VisionSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <QuickLinks />
      <AnnouncementSection />
      <VisionSection />
    </main>
  )
}
