import React, { useState, useEffect } from 'react';
import { ChevronRight, Calendar, MapPin, User, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

interface GalleryImage {
  id: string;
  image: string;
  title: string;
  description: string;
  alt_text: string;
  is_primary: boolean;
  is_before_image: boolean;
  tags: string;
  order: number;
  created_at: string;
}

interface GalleryProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  client_name: string;
  project_date: string;
  location: string;
  materials_used: string;
  dimensions: string;
  price_range: string;
  featured: boolean;
  primary_image: GalleryImage | null;
  image_count: number;
  category_name: string;
  created_at: string;
  images?: GalleryImage[];
}

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  projects: GalleryProject[];
  project_count: number;
  total_images: number;
  created_at: string;
}

interface ImageModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}) => {
  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-12">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-700 hover:text-primary-600 transition-colors duration-200"
          style={{ fontSize: '2.5rem', padding: '0.75rem 1.5rem' }}
          aria-label="Close"
        >
          ×
        </button>

        <div className="w-full flex flex-col items-center justify-center">
          <div className="mb-8 flex justify-center">
            <img
              src={currentImage.image}
              alt={currentImage.alt_text || currentImage.title}
              className="max-h-[70vh] w-auto rounded-xl shadow-lg mx-auto"
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center gap-8 mb-4">
              <button
                onClick={onPrevious}
                className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-2xl"
                aria-label="Previous"
              >
                <ChevronRight className="w-8 h-8 rotate-180" />
              </button>
              <span className="text-gray-700 font-semibold text-lg">
                {currentIndex + 1} / {images.length}
              </span>
              <button
                onClick={onNext}
                className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-2xl"
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}
          {/* Image info */}
          <div className="w-full bg-black/70 backdrop-blur-sm text-white p-6 rounded-xl mt-2">
            <div className="flex items-center justify-between">
              <div>
                {currentImage.title && (
                  <h3 className="text-xl font-semibold">{currentImage.title}</h3>
                )}
                {currentImage.description && (
                  <p className="text-base text-gray-300 mt-1">{currentImage.description}</p>
                )}
              </div>
              <div className="text-base text-gray-300">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{
    images: GalleryImage[];
    currentIndex: number;
    isOpen: boolean;
  }>({
    images: [],
    currentIndex: 0,
    isOpen: false
  });

  // Fetch gallery categories
  const { data: categories, isLoading } = useQuery<GalleryCategory[]>({
    queryKey: ['gallery-categories'],
    queryFn: async () => {
      try {
        const response = await api.get('/gallery-categories/');
        return response.data.results || response.data;
      } catch (error) {
        // Silently fail and return empty array
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity
  });

  // Fetch projects for selected category
  const { data: projects, isLoading: projectsLoading } = useQuery<GalleryProject[]>({
    queryKey: ['gallery-category-projects', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      try {
        const response = await api.get(`/gallery-categories/${selectedCategory}/projects/`);
        return response.data;
      } catch (error) {
        // Silently fail and return empty array
        return [];
      }
    },
    enabled: !!selectedCategory,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity
  });

  const openImageModal = (images: GalleryImage[], index: number) => {
    setModalData({
      images,
      currentIndex: index,
      isOpen: true
    });
  };

  const closeImageModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  const nextImage = () => {
    setModalData(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const previousImage = () => {
    setModalData(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  // Show empty state when no categories are available
  const hasNoData = !isLoading && (!categories || categories.length === 0);

  if (isLoading) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Our Project Gallery
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Explore our completed projects and see how we transform spaces with custom furniture solutions. 
              Each project tells a unique story of craftsmanship and design excellence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {categories?.reduce((sum, cat) => sum + cat.project_count, 0) || 0}
                </div>
                <div className="text-gray-300">Completed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {categories?.length || 0}
                </div>
                <div className="text-gray-300">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {categories?.reduce((sum, cat) => sum + cat.total_images, 0) || 0}
                </div>
                <div className="text-gray-300">Photos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layout: Sidebar filter and gallery content */}
      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8 py-8">
        {/* Sidebar Filter */}
        {hasNoData ? (
          <aside className="w-full lg:w-80 flex-shrink-0 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Filter by Category</h3>
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No categories available yet.</p>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="w-full lg:w-80 flex-shrink-0 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Filter by Category</h3>
              <div className="flex flex-col gap-3">
                <button
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 border text-left ${selectedCategory === null ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-primary-50 hover:border-primary-200'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>
                {categories?.map(category => (
                  <button
                    key={category.id}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 border text-left ${selectedCategory === category.slug ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-primary-50 hover:border-primary-200'}`}
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Gallery Content */}
        <main className="flex-1">
          {hasNoData ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gallery Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're preparing our project gallery to showcase our amazing work. Check back soon to see our completed projects!
              </p>
            </div>
          ) : !selectedCategory ? (
            <div className="text-center py-16">
              <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select a category to view projects
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Choose a category on the left to see our completed projects!
              </p>
            </div>
          ) : projectsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: GalleryProject) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={async () => {
                    // If images are not loaded, fetch them
                    let images = project.images;
                    if (!images || images.length === 0) {
                      try {
                        const response = await api.get(`/gallery-projects/${project.slug}/`);
                        images = response.data.images || [];
                      } catch (err) {
                        images = [];
                      }
                    }
                    openImageModal(images ?? [], 0);
                  }}
                >
                  <div className="p-6 flex items-center">
                    {project.primary_image && (
                      <img
                        src={project.primary_image.image}
                        alt={project.primary_image.alt_text || project.title}
                        className="w-20 h-20 object-cover rounded-lg mr-6"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 mb-3">
                          {project.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {project.client_name && (
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {project.client_name}
                          </span>
                        )}
                        {project.project_date && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(project.project_date).toLocaleDateString()}
                          </span>
                        )}
                        {project.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {project.location}
                          </span>
                        )}
                        <span className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          {project.image_count} photos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p>This category doesn't have any projects yet.</p>
            </div>
          )}
        </main>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={modalData.images}
        currentIndex={modalData.currentIndex}
        isOpen={modalData.isOpen}
        onClose={closeImageModal}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </div>
  );
};

export default Gallery;