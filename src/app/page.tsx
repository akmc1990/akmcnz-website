import HeroSection from '@/components/home/HeroSection'
import VisionSection from '@/components/home/VisionSection'
import AnnouncementSection from '@/components/home/AnnouncementSection'
import QuickLinks from '@/components/home/QuickLinks'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AnnouncementSection />
      <VisionSection />
      <QuickLinks />
    </div>
  )
}
