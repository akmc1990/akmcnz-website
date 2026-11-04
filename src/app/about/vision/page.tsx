import VisionSection from '@/components/home/VisionSection'

export default function VisionPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-2">교회 비전</h1>
          <p className="text-gray-400">Church Vision</p>
        </div>
      </div>
      <VisionSection hideHeading longLayout />
    </div>
  )
}
