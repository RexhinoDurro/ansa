// client/src/pages/CustomRequestPage.tsx (Complete File with Translation Support)
import React, { useState } from 'react';
import { ChevronDown, Palette, Send, Globe } from 'lucide-react';

// Translation interface
interface Translations {
  [key: string]: string;
}

// English translations
const enTranslations: Translations = {
  // Navigation
  'nav.home': 'Home',
  'nav.customRequest': 'Custom Request',
  
  // Header
  'header.title': 'Custom Request',
  'header.subtitle': 'Tell us exactly what you need and we\'ll create something unique just for you',
  
  // Form sections
  'section.projectDetails': 'Project Details',
  'section.specifications': 'Specifications',
  'section.contactInformation': 'Contact Information',
  
  // Overview sidebar
  'overview.title': 'Request Overview',
  'overview.clearAll': 'Clear All Fields',
  'overview.project': 'Project:',
  'overview.style': 'Style:',
  'overview.budget': 'Budget:',
  'overview.color': 'Color:',
  'overview.notSpecified': 'Not specified',
  
  // Project Details fields
  'project.title.label': 'Project Title',
  'project.title.placeholder': 'What would you like to call your project?',
  'project.description.label': 'Project Description',
  'project.description.placeholder': 'Describe in detail what you want us to create for you...',
  'project.additional.label': 'Additional Requirements',
  'project.additional.placeholder': 'Any other specific requirements, features, or notes...',
  
  // Specifications fields
  'specs.dimensions.label': 'Dimensions',
  'specs.width.placeholder': 'Width (e.g., 120cm, 4ft)',
  'specs.height.placeholder': 'Height (e.g., 80cm, 3ft)',
  'specs.primaryColor.label': 'Primary Color',
  'specs.style.label': 'Style Preference',
  'specs.style.placeholder': 'Select a style...',
  'specs.deadline.label': 'Preferred Deadline',
  'specs.budget.label': 'Budget Range',
  'specs.budget.placeholder': 'Select budget range...',
  
  // Style options
  'style.modern': 'Modern',
  'style.minimal': 'Minimal',
  'style.classic': 'Classic',
  'style.traditional': 'Traditional',
  'style.contemporary': 'Contemporary',
  'style.rustic': 'Rustic',
  'style.scandinavian': 'Scandinavian',
  
  // Budget options
  'budget.under500': 'Under €500',
  'budget.500to1000': '€500 - €1,000',
  'budget.1000to2500': '€1,000 - €2,500',
  'budget.2500to5000': '€2,500 - €5,000',
  'budget.over5000': 'Over €5,000',
  
  // Contact fields
  'contact.name.label': 'Full Name',
  'contact.name.placeholder': 'Your full name',
  'contact.email.label': 'Email Address',
  'contact.email.placeholder': 'your.email@example.com',
  'contact.phone.label': 'Phone Number',
  'contact.phone.placeholder': '+355 69 123 4567',
  'contact.method.label': 'Preferred Contact Method',
  'contact.method.email': 'Email',
  'contact.method.phone': 'Phone',
  'contact.method.both': 'Both Email & Phone',
  
  // Form actions
  'form.required': '*',
  'form.submit': 'Submit Custom Request',
  'form.validation.required': 'Please fill in all required fields marked with *',
  'form.success': 'Thank you! Your custom request has been submitted. We will contact you soon!',
  'form.error': 'There was an error submitting your request. Please try again.',
  
  // Language selector
  'language.current': 'English',
  'language.select': 'Select Language'
};

// Albanian translations
const sqTranslations: Translations = {
  // Navigation
  'nav.home': 'Kreu',
  'nav.customRequest': 'Kërkesë e Personalizuar',
  
  // Header
  'header.title': 'Kërkesë e Personalizuar',
  'header.subtitle': 'Na tregoni saktësisht çfarë keni nevojë dhe ne do të krijojmë diçka unike vetëm për ju',
  
  // Form sections
  'section.projectDetails': 'Detajet e Projektit',
  'section.specifications': 'Specifikimet',
  'section.contactInformation': 'Informacioni i Kontaktit',
  
  // Overview sidebar
  'overview.title': 'Përmbledhje e Kërkesës',
  'overview.clearAll': 'Pastro të Gjitha Fushat',
  'overview.project': 'Projekti:',
  'overview.style': 'Stili:',
  'overview.budget': 'Buxheti:',
  'overview.color': 'Ngjyra:',
  'overview.notSpecified': 'Nuk është specifikuar',
  
  // Project Details fields
  'project.title.label': 'Titulli i Projektit',
  'project.title.placeholder': 'Si do ta quanit projektin tuaj?',
  'project.description.label': 'Përshkrimi i Projektit',
  'project.description.placeholder': 'Përshkruani në detaje çfarë dëshironi të krijojmë për ju...',
  'project.additional.label': 'Kërkesat Shtesë',
  'project.additional.placeholder': 'Çdo kërkesë, veçori ose shënim të veçantë tjetër...',
  
  // Specifications fields
  'specs.dimensions.label': 'Përmasat',
  'specs.width.placeholder': 'Gjerësia (p.sh., 120cm, 4ft)',
  'specs.height.placeholder': 'Lartësia (p.sh., 80cm, 3ft)',
  'specs.primaryColor.label': 'Ngjyra Kryesore',
  'specs.style.label': 'Preferencat e Stilit',
  'specs.style.placeholder': 'Zgjidhni një stil...',
  'specs.deadline.label': 'Afati i Preferuar',
  'specs.budget.label': 'Diapazoni i Buxhetit',
  'specs.budget.placeholder': 'Zgjidhni diapazonin e buxhetit...',
  
  // Style options
  'style.modern': 'Modern',
  'style.minimal': 'Minimal',
  'style.classic': 'Klasik',
  'style.traditional': 'Tradicional',
  'style.contemporary': 'Bashkëkohor',
  'style.rustic': 'Rustik',
  'style.scandinavian': 'Skandinav',
  
  // Budget options
  'budget.under500': 'Nën €500',
  'budget.500to1000': '€500 - €1,000',
  'budget.1000to2500': '€1,000 - €2,500',
  'budget.2500to5000': '€2,500 - €5,000',
  'budget.over5000': 'Mbi €5,000',
  
  // Contact fields
  'contact.name.label': 'Emri i Plotë',
  'contact.name.placeholder': 'Emri juaj i plotë',
  'contact.email.label': 'Adresa e Email-it',
  'contact.email.placeholder': 'emaili.juaj@shembull.com',
  'contact.phone.label': 'Numri i Telefonit',
  'contact.phone.placeholder': '+355 69 123 4567',
  'contact.method.label': 'Metoda e Preferuar e Kontaktit',
  'contact.method.email': 'Email',
  'contact.method.phone': 'Telefon',
  'contact.method.both': 'Email dhe Telefon',
  
  // Form actions
  'form.required': '*',
  'form.submit': 'Dërgo Kërkesën e Personalizuar',
  'form.validation.required': 'Ju lutemi plotësoni të gjitha fushat e detyrueshme të shënuara me *',
  'form.success': 'Faleminderit! Kërkesa juaj e personalizuar është dërguar. Ne do t\'ju kontaktojmë së shpejti!',
  'form.error': 'Pati një gabim në dërgimin e kërkesës suaj. Ju lutemi provoni përsëri.',
  
  // Language selector
  'language.current': 'Shqip',
  'language.select': 'Zgjidhni Gjuhën'
};

// Italian translations
const itTranslations: Translations = {
  // Navigation
  'nav.home': 'Home',
  'nav.customRequest': 'Richiesta Personalizzata',
  
  // Header
  'header.title': 'Richiesta Personalizzata',
  'header.subtitle': 'Dicci esattamente cosa ti serve e creeremo qualcosa di unico solo per te',
  
  // Form sections
  'section.projectDetails': 'Dettagli del Progetto',
  'section.specifications': 'Specifiche',
  'section.contactInformation': 'Informazioni di Contatto',
  
  // Overview sidebar
  'overview.title': 'Panoramica della Richiesta',
  'overview.clearAll': 'Cancella Tutti i Campi',
  'overview.project': 'Progetto:',
  'overview.style': 'Stile:',
  'overview.budget': 'Budget:',
  'overview.color': 'Colore:',
  'overview.notSpecified': 'Non specificato',
  
  // Project Details fields
  'project.title.label': 'Titolo del Progetto',
  'project.title.placeholder': 'Come vorresti chiamare il tuo progetto?',
  'project.description.label': 'Descrizione del Progetto',
  'project.description.placeholder': 'Descrivi in dettaglio cosa vuoi che creiamo per te...',
  'project.additional.label': 'Requisiti Aggiuntivi',
  'project.additional.placeholder': 'Qualsiasi altro requisito specifico, caratteristica o nota...',
  
  // Specifications fields
  'specs.dimensions.label': 'Dimensioni',
  'specs.width.placeholder': 'Larghezza (es. 120cm, 4ft)',
  'specs.height.placeholder': 'Altezza (es. 80cm, 3ft)',
  'specs.primaryColor.label': 'Colore Primario',
  'specs.style.label': 'Preferenza di Stile',
  'specs.style.placeholder': 'Seleziona uno stile...',
  'specs.deadline.label': 'Scadenza Preferita',
  'specs.budget.label': 'Fascia di Budget',
  'specs.budget.placeholder': 'Seleziona la fascia di budget...',
  
  // Style options
  'style.modern': 'Moderno',
  'style.minimal': 'Minimalista',
  'style.classic': 'Classico',
  'style.traditional': 'Tradizionale',
  'style.contemporary': 'Contemporaneo',
  'style.rustic': 'Rustico',
  'style.scandinavian': 'Scandinavo',
  
  // Budget options
  'budget.under500': 'Sotto €500',
  'budget.500to1000': '€500 - €1.000',
  'budget.1000to2500': '€1.000 - €2.500',
  'budget.2500to5000': '€2.500 - €5.000',
  'budget.over5000': 'Oltre €5.000',
  
  // Contact fields
  'contact.name.label': 'Nome Completo',
  'contact.name.placeholder': 'Il tuo nome completo',
  'contact.email.label': 'Indirizzo Email',
  'contact.email.placeholder': 'tua.email@esempio.com',
  'contact.phone.label': 'Numero di Telefono',
  'contact.phone.placeholder': '+39 333 123 4567',
  'contact.method.label': 'Metodo di Contatto Preferito',
  'contact.method.email': 'Email',
  'contact.method.phone': 'Telefono',
  'contact.method.both': 'Email e Telefono',
  
  // Form actions
  'form.required': '*',
  'form.submit': 'Invia Richiesta Personalizzata',
  'form.validation.required': 'Si prega di compilare tutti i campi obbligatori contrassegnati con *',
  'form.success': 'Grazie! La tua richiesta personalizzata è stata inviata. Ti contatteremo presto!',
  'form.error': 'Si è verificato un errore nell\'invio della tua richiesta. Riprova per favore.',
  
  // Language selector
  'language.current': 'Italiano',
  'language.select': 'Seleziona Lingua'
};

// Available languages
const languages = {
  en: { name: 'English', translations: enTranslations },
  sq: { name: 'Shqip', translations: sqTranslations },
  it: { name: 'Italiano', translations: itTranslations }
};

interface FormData {
  title: string;
  description: string;
  width: string;
  height: string;
  primary_color: string;
  style: string;
  deadline: string;
  budget: string;
  additional: string;
  name: string;
  email: string;
  phone: string;
  contact_method: string;
}

const CustomRequestPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'sq' | 'it'>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    width: '',
    height: '',
    primary_color: '#3b82f6',
    style: '',
    deadline: '',
    budget: '',
    additional: '',
    name: '',
    email: '',
    phone: '',
    contact_method: 'email'
  });

  const [expandedSections, setExpandedSections] = useState({
    project: true,
    specifications: true,
    contact: true
  });

  // Translation function
  const t = (key: string): string => {
    return languages[currentLanguage].translations[key] || key;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLanguageChange = (lang: 'en' | 'sq' | 'it') => {
    setCurrentLanguage(lang);
    setShowLanguageMenu(false);
  };

  const formatBudgetDisplay = (budget: string) => {
    const budgetMap: { [key: string]: string } = {
      'under-500': t('budget.under500'),
      '500-1000': t('budget.500to1000'),
      '1000-2500': t('budget.1000to2500'),
      '2500-5000': t('budget.2500to5000'),
      'over-5000': t('budget.over5000')
    };
    return budgetMap[budget] || budget;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.description || !formData.name || !formData.email) {
      alert(t('form.validation.required'));
      return;
    }
    
    try {
      const response = await fetch('/api/custom-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: currentLanguage
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || t('form.success'));
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          width: '',
          height: '',
          primary_color: '#3b82f6',
          style: '',
          deadline: '',
          budget: '',
          additional: '',
          name: '',
          email: '',
          phone: '',
          contact_method: 'email'
        });
      } else {
        alert(t('form.error'));
      }
    } catch (error) {
      console.error('Error submitting custom request:', error);
      alert(t('form.error'));
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      width: '',
      height: '',
      primary_color: '#3b82f6',
      style: '',
      deadline: '',
      budget: '',
      additional: '',
      name: '',
      email: '',
      phone: '',
      contact_method: 'email'
    });
  };

  const hasFormData = Object.values(formData).some(value => value !== '' && value !== 'email' && value !== '#3b82f6');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                {languages[currentLanguage].name}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-32">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code as 'en' | 'sq' | 'it')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                        currentLanguage === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-blue-600 transition-colors duration-200">
              {t('nav.home')}
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{t('nav.customRequest')}</span>
          </nav>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-4">
            <Palette className="w-10 h-10 text-blue-600" />
            {t('header.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('header.subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">{t('overview.title')}</h3>
              
              {hasFormData && (
                <button
                  onClick={clearForm}
                  className="w-full mb-4 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  {t('overview.clearAll')}
                </button>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-600">{t('overview.project')}</span>
                  <div className="font-medium text-gray-900 mt-1">
                    {formData.title || t('overview.notSpecified')}
                  </div>
                </div>
                
                {formData.style && (
                  <div>
                    <span className="text-gray-600">{t('overview.style')}</span>
                    <div className="font-medium text-gray-900 mt-1">
                      {t(`style.${formData.style}`) || formData.style}
                    </div>
                  </div>
                )}
                
                {formData.budget && (
                  <div>
                    <span className="text-gray-600">{t('overview.budget')}</span>
                    <div className="font-medium text-gray-900 mt-1">
                      {formatBudgetDisplay(formData.budget)}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600">{t('overview.color')}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: formData.primary_color }}
                    />
                    <span className="font-medium text-gray-900">
                      {formData.primary_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Project Details Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('project')}
                    className="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">{t('section.projectDetails')}</h2>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      expandedSections.project ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.project && (
                    <div className="space-y-6 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('project.title.label')} <span className="text-red-600">{t('form.required')}</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder={t('project.title.placeholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('project.description.label')} <span className="text-red-600">{t('form.required')}</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder={t('project.description.placeholder')}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('project.additional.label')}
                        </label>
                        <textarea
                          name="additional"
                          value={formData.additional}
                          onChange={handleInputChange}
                          placeholder={t('project.additional.placeholder')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Specifications Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('specifications')}
                    className="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">{t('section.specifications')}</h2>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      expandedSections.specifications ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.specifications && (
                    <div className="space-y-6 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('specs.dimensions.label')}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="width"
                            value={formData.width}
                            onChange={handleInputChange}
                            placeholder={t('specs.width.placeholder')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                          <input
                            type="text"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            placeholder={t('specs.height.placeholder')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('specs.primaryColor.label')}
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            name="primary_color"
                            value={formData.primary_color}
                            onChange={handleInputChange}
                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.primary_color}
                            onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                            placeholder="#3b82f6"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('specs.style.label')}
                        </label>
                        <select
                          name="style"
                          value={formData.style}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">{t('specs.style.placeholder')}</option>
                          <option value="modern">{t('style.modern')}</option>
                          <option value="minimal">{t('style.minimal')}</option>
                          <option value="classic">{t('style.classic')}</option>
                          <option value="traditional">{t('style.traditional')}</option>
                          <option value="contemporary">{t('style.contemporary')}</option>
                          <option value="rustic">{t('style.rustic')}</option>
                          <option value="scandinavian">{t('style.scandinavian')}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            {t('specs.deadline.label')}
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            {t('specs.budget.label')}
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          >
                            <option value="">{t('specs.budget.placeholder')}</option>
                            <option value="under-500">{t('budget.under500')}</option>
                            <option value="500-1000">{t('budget.500to1000')}</option>
                            <option value="1000-2500">{t('budget.1000to2500')}</option>
                            <option value="2500-5000">{t('budget.2500to5000')}</option>
                            <option value="over-5000">{t('budget.over5000')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information Section */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('contact')}
                    className="flex items-center justify-between w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">{t('section.contactInformation')}</h2>
                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      expandedSections.contact ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedSections.contact && (
                    <div className="space-y-6 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('contact.name.label')} <span className="text-red-600">{t('form.required')}</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('contact.name.placeholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('contact.email.label')} <span className="text-red-600">{t('form.required')}</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('contact.email.placeholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('contact.phone.label')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t('contact.phone.placeholder')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t('contact.method.label')}
                        </label>
                        <select
                          name="contact_method"
                          value={formData.contact_method}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="email">{t('contact.method.email')}</option>
                          <option value="phone">{t('contact.method.phone')}</option>
                          <option value="both">{t('contact.method.both')}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    type="submit"
                    className="w-full lg:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {t('form.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRequestPage;