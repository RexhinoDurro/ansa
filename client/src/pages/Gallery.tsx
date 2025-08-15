import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Eye, Calendar, MapPin, User, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

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
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
      >
        ×
      </button>

      <div className="relative max-w-7xl max-h-full flex items-center justify-center">
        <img
          src={currentImage.image}
          alt={currentImage.alt_text || currentImage.title}
          className="max-w-full max-h-[90vh] object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image info */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              {currentImage.title && (
                <h3 className="text-lg font-semibold">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="text-sm text-gray-300 mt-1">{currentImage.description}</p>
              )}
            </div>
            <div className="text-sm text-gray-300">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ 
  project: GalleryProject; 
  isExpanded: boolean; 
  onToggle: () => void;
  onImageClick: (images: GalleryImage[], index: number) => void;
}> = ({ project, isExpanded, onToggle, onImageClick }) => {
  const { data: projectDetail, isLoading } = useQuery({
    queryKey: ['gallery-project', project.slug],
    queryFn: async () => {
      const response = await api.get(`/gallery-projects/${project.slug}/`);
      return response.data;
    },
    enabled: isExpanded
  });

  const images = projectDetail?.images || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Project Header */}
      <div 
        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
                
                <div className="flex-1">
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
            
            {project.primary_image && (
              <div className="ml-4 flex-shrink-0">
                <img
                  src={project.primary_image.image}
                  alt={project.primary_image.alt_text || project.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {isLoading ? (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : images.length > 0 ? (
            <div className="p-6">
              {/* Project Details */}
              {(project.materials_used || project.dimensions) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Project Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {project.materials_used && (
                      <div>
                        <span className="font-medium text-gray-700">Materials:</span>
                        <span className="ml-2 text-gray-600">{project.materials_used}</span>
                      </div>
                    )}
                    {project.dimensions && (
                      <div>
                        <span className="font-medium text-gray-700">Dimensions:</span>
                        <span className="ml-2 text-gray-600">{project.dimensions}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image: GalleryImage, index: number) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => onImageClick(images, index)}
                  >
                    <img
                      src={image.image}
                      alt={image.alt_text || image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Image badges */}
                    <div className="absolute top-2 left-2">
                      {image.is_primary && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      {image.is_before_image && (
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded ml-1">
                          Before
                        </span>
                      )}
                    </div>
                    
                    {/* Image title */}
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-sm font-medium truncate">
                          {image.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No images available for this project</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Gallery: React.FC = () => {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
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
      const response = await api.get('/gallery-categories/');
      return response.data.results || response.data;
    }
  });

  // Fetch all projects data for expanded categories
  const expandedCategoryProjects = useQuery({
    queryKey: ['gallery-category-projects', Array.from(expandedProjects)],
    queryFn: async () => {
      const projectsData: Record<string, GalleryProject[]> = {};
      
      // Only fetch for expanded categories
      const expandedCategorySlugs = Array.from(expandedProjects).filter(slug => 
        categories?.some(cat => cat.slug === slug)
      );
      
      for (const categorySlug of expandedCategorySlugs) {
        try {
          const response = await api.get(`/gallery-categories/${categorySlug}/projects/`);
          projectsData[categorySlug] = response.data;
        } catch (error) {
          console.error(`Failed to fetch projects for ${categorySlug}:`, error);
          projectsData[categorySlug] = [];
        }
      }
      
      return projectsData;
    },
    enabled: expandedProjects.size > 0 && !!categories
  });

  const toggleCategory = (categorySlug: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(categorySlug)) {
      newExpanded.delete(categorySlug);
    } else {
      newExpanded.add(categorySlug);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

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

      {/* Gallery Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {categories && categories.length > 0 ? (
            <div className="space-y-6">
              {categories.map((category) => {
                const isExpanded = expandedProjects.has(category.slug);
                const projects = expandedCategoryProjects.data?.[category.slug] || [];

                return (
                  <div key={category.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                    {/* Category Header */}
                    <div 
                      className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleCategory(category.slug)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {isExpanded ? (
                              <ChevronDown className="w-6 h-6 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-6 h-6 text-gray-600" />
                            )}
                            
                            <div>
                              <h2 className="text-2xl font-serif font-bold text-gray-900">
                                {category.name}
                              </h2>
                              {category.description && (
                                <p className="text-gray-600 mt-1">
                                  {category.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>{category.project_count} projects</span>
                                <span>{category.total_images} photos</span>
                              </div>
                            </div>
                          </div>
                          
                          {category.cover_image && (
                            <div className="ml-4">
                              <img
                                src={category.cover_image}
                                alt={category.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category Projects */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-6">
                        {expandedCategoryProjects.isLoading ? (
                          <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                              <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                              </div>
                            ))}
                          </div>
                        ) : projects.length > 0 ? (
                          <div className="space-y-4">
                            {projects.map((project: GalleryProject) => (
                              <ProjectCard
                                key={project.id}
                                project={project}
                                isExpanded={expandedProjects.has(project.id)}
                                onToggle={() => toggleProject(project.id)}
                                onImageClick={openImageModal}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                            <p>This category doesn't have any projects yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gallery Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're preparing our project gallery to showcase our amazing work. 
                Check back soon to see our completed projects!
              </p>
            </div>
          )}
        </div>
      </section>

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