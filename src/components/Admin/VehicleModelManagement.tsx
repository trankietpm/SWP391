"use client";
import React, { useState, useEffect } from 'react';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { vehicleModelService, VehicleModel, getImageUrl } from '../../services/vehicle-model.service';
import styles from './VehicleManagement.module.scss';

const VehicleModelManagement: React.FC = () => {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Xe máy điện' | 'Ô tô điện'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingModel, setViewingModel] = useState<VehicleModel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [featureInput, setFeatureInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formHighlights, setFormHighlights] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Ô tô điện' as 'Xe máy điện' | 'Ô tô điện',
    price: '',
    rating: '',
    description: '',
    battery: '',
    range: '',
    charging: '',
    seats: '',
    topSpeed: '',
    acceleration: '',
    isPopular: false,
  });

  const fetchModels = async () => {
    try {
      setLoading(true);
      const apiModels = await vehicleModelService.getAllVehicleModels();
      setModels(apiModels);
    } catch (error) {
      console.error('Error fetching models:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || model.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentModels = filteredModels.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mẫu xe này?')) {
      try {
        const success = await vehicleModelService.deleteVehicleModel(id);
        if (success) {
          await fetchModels();
        } else {
          alert('Có lỗi xảy ra khi xóa mẫu xe');
        }
      } catch (error) {
        console.error('Error deleting model:', error);
        alert('Có lỗi xảy ra khi xóa mẫu xe');
      }
    }
  };

  const handleAddNew = () => {
    setEditingModel(null);
    setFormData({
      name: '',
      type: 'Ô tô điện',
      price: '',
      rating: '',
      description: '',
      battery: '',
      range: '',
      charging: '',
      seats: '',
      topSpeed: '',
      acceleration: '',
      isPopular: false,
    });
    setFormFeatures([]);
    setFormHighlights([]);
    setSelectedImages([]);
    setCurrentImages([]);
    setShowModal(true);
  };

  const handleEdit = (model: VehicleModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      type: model.type,
      price: model.price.toString(),
      rating: model.rating.toString(),
      description: model.description || '',
      battery: model.battery,
      range: model.range,
      charging: model.charging,
      seats: model.seats,
      topSpeed: model.topSpeed,
      acceleration: model.acceleration,
      isPopular: model.isPopular,
    });
    setFormFeatures([...model.features]);
    setFormHighlights([...model.highlights]);
    setSelectedImages([]);
    setCurrentImages([...(model.images || [])]);
    setShowModal(true);
  };

  const handleView = (model: VehicleModel) => {
    setViewingModel(model);
    setShowViewModal(true);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setUploadingImages(true);
      
      const base64Images: string[] = [];
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          try {
            const base64 = await convertFileToBase64(image);
            base64Images.push(base64);
          } catch (error) {
            console.error('Error converting image:', error);
            alert(`Lỗi khi xử lý ảnh: ${image.name}`);
          }
        }
      }

      const data = {
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price.replace(/,/g, '')) || 0,
        rating: parseFloat(formData.rating) || 0,
        isPopular: formData.isPopular,
        description: formData.description || '',
        battery: formData.battery,
        range: formData.range,
        charging: formData.charging,
        seats: formData.seats,
        topSpeed: formData.topSpeed,
        acceleration: formData.acceleration,
        features: formFeatures,
        highlights: formHighlights,
        images: currentImages,
        ...(base64Images.length > 0 && { base64Images }),
      };

      if (editingModel) {
        await vehicleModelService.updateVehicleModel(editingModel.id, data);
      } else {
        await vehicleModelService.createVehicleModel(data);
      }
      
      await fetchModels();
      setShowModal(false);
      setEditingModel(null);
      setFormFeatures([]);
      setFormHighlights([]);
      setSelectedImages([]);
      setCurrentImages([]);
    } catch (error) {
      console.error('Error saving model:', error);
      alert('Có lỗi xảy ra khi lưu mẫu xe');
    } finally {
      setUploadingImages(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !formFeatures.includes(featureInput.trim())) {
      setFormFeatures([...formFeatures, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormFeatures(formFeatures.filter(f => f !== feature));
  };

  const addHighlight = () => {
    if (highlightInput.trim() && !formHighlights.includes(highlightInput.trim())) {
      setFormHighlights([...formHighlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const removeHighlight = (highlight: string) => {
    setFormHighlights(formHighlights.filter(h => h !== highlight));
  };

  const handleRemoveCurrentImage = (indexToRemove: number) => {
    setCurrentImages(currentImages.filter((_, index) => index !== indexToRemove));
  };

  if (loading) {
    return (
      <div className={styles.vehicleManagement}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <LoadingOutlined style={{ fontSize: 48 }} />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.vehicleManagement}>
      <div className={styles.header}>
        <h1>Quản lý mẫu xe</h1>
        <button className={styles.addBtn} onClick={handleAddNew}>
          <PlusOutlined />
          Thêm mẫu xe mới
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm mẫu xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterBox}>
          <FilterOutlined />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'Xe máy điện' | 'Ô tô điện')}
          >
            <option value="all">Tất cả loại xe</option>
            <option value="Ô tô điện">Ô tô điện</option>
            <option value="Xe máy điện">Xe máy điện</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên mẫu xe</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Đánh giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentModels.map((model) => (
              <tr key={model.id}>
                <td>{model.id}</td>
                <td className={styles.vehicleName}>{model.name}</td>
                <td>
                  <span className={`${styles.typeTag} ${model.type === 'Ô tô điện' ? styles.car : styles.motorcycle}`}>
                    {model.type}
                  </span>
                </td>
                <td className={styles.price}>{model.price.toLocaleString('vi-VN')} VNĐ/ngày</td>
                <td>
                  <div className={styles.rating}>
                    <span>{model.rating.toFixed(1)}</span>
                    <span style={{ color: '#ffc107' }}>★</span>
                  </div>
                </td>
                <td>
                  {model.isPopular ? (
                    <span className={styles.popularTag}>Phổ biến</span>
                  ) : (
                    <span style={{ color: '#999' }}>Không phổ biến</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleView(model)}
                      title="Xem chi tiết"
                    >
                      <EyeOutlined />
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(model)}
                      title="Chỉnh sửa"
                    >
                      <EditOutlined />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(model.id)}
                      title="Xóa"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredModels.length)} trong {filteredModels.length} mẫu xe
        </div>
        <div className={styles.paginationControls}>
          <button 
            className={styles.paginationBtn}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            Đầu
          </button>
          <button 
            className={styles.paginationBtn}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className={styles.paginationBtn}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
          <button 
            className={styles.paginationBtn}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Cuối
          </button>
        </div>
      </div>
      )}

      {/* Add/Edit Modal - Simplified version, bạn có thể copy từ VehicleManagement */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingModel ? 'Chỉnh sửa mẫu xe' : 'Thêm mẫu xe mới'}</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tên mẫu xe *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nhập tên mẫu xe"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Loại xe *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'Xe máy điện' | 'Ô tô điện'})}
                      required
                    >
                      <option value="Ô tô điện">Ô tô điện</option>
                      <option value="Xe máy điện">Xe máy điện</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Giá (VNĐ/ngày) *</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Nhập giá"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Đánh giá</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      placeholder="Nhập đánh giá (0-5)"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Trạng thái</label>
                    <select
                      value={formData.isPopular ? 'true' : 'false'}
                      onChange={(e) => setFormData({...formData, isPopular: e.target.value === 'true'})}
                    >
                      <option value="false">Không phổ biến</option>
                      <option value="true">Phổ biến</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Nhập mô tả mẫu xe"
                    rows={3}
                  />
                </div>

                <div className={styles.sectionTitle}>Thông số kỹ thuật</div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Pin *</label>
                    <input
                      type="text"
                      value={formData.battery}
                      onChange={(e) => setFormData({...formData, battery: e.target.value})}
                      placeholder="Ví dụ: Pin Lithium-ion 87.7 kWh"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tầm hoạt động *</label>
                    <input
                      type="text"
                      value={formData.range}
                      onChange={(e) => setFormData({...formData, range: e.target.value})}
                      placeholder="Ví dụ: 400km (WLTP)"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Sạc *</label>
                    <input
                      type="text"
                      value={formData.charging}
                      onChange={(e) => setFormData({...formData, charging: e.target.value})}
                      placeholder="Ví dụ: Sạc nhanh DC 150kW"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số chỗ ngồi *</label>
                    <input
                      type="text"
                      value={formData.seats}
                      onChange={(e) => setFormData({...formData, seats: e.target.value})}
                      placeholder="Ví dụ: 5 chỗ ngồi"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tốc độ tối đa *</label>
                    <input
                      type="text"
                      value={formData.topSpeed}
                      onChange={(e) => setFormData({...formData, topSpeed: e.target.value})}
                      placeholder="Ví dụ: 200 km/h"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Gia tốc *</label>
                    <input
                      type="text"
                      value={formData.acceleration}
                      onChange={(e) => setFormData({...formData, acceleration: e.target.value})}
                      placeholder="Ví dụ: 0-100 km/h trong 5.5 giây"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Tính năng</label>
                  <div className={styles.servicesInput}>
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Nhập tính năng và nhấn Enter"
                    />
                    <button type="button" onClick={addFeature}>Thêm</button>
                  </div>
                  <div className={styles.servicesList}>
                    {formFeatures.map((feature, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {feature}
                        <button type="button" onClick={() => removeFeature(feature)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Điểm nổi bật</label>
                  <div className={styles.servicesInput}>
                    <input
                      type="text"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                      placeholder="Nhập điểm nổi bật và nhấn Enter"
                    />
                    <button type="button" onClick={addHighlight}>Thêm</button>
                  </div>
                  <div className={styles.servicesList}>
                    {formHighlights.map((highlight, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {highlight}
                        <button type="button" onClick={() => removeHighlight(highlight)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Ảnh mẫu xe</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedImages(Array.from(e.target.files));
                      }
                    }}
                    style={{ marginBottom: '10px' }}
                  />
                  {selectedImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                      {selectedImages.map((image, index) => (
                        <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                            style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              background: 'red',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentImages && currentImages.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ marginBottom: '5px', fontSize: '12px', color: '#666' }}>Ảnh hiện tại:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {currentImages.map((imgUrl, index) => (
                          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                              src={getImageUrl(imgUrl)}
                              alt={`Current ${index}`}
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCurrentImage(index)}
                              style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#ff4d4f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                lineHeight: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                padding: 0
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ff7875';
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ff4d4f';
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button 
                className={styles.saveBtn}
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.querySelector('form') as HTMLFormElement;
                  if (form) form.requestSubmit();
                }}
                disabled={uploadingImages}
              >
                {uploadingImages ? 'Đang lưu...' : editingModel ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingModel && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết mẫu xe</h2>
              <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.viewContent}>
                <div className={styles.viewSection}>
                  <h3>Thông tin cơ bản</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Tên mẫu xe:</label>
                      <span>{viewingModel.name}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Loại xe:</label>
                      <span>{viewingModel.type}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Giá thuê:</label>
                      <span>{viewingModel.price.toLocaleString('vi-VN')} VNĐ/ngày</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Đánh giá:</label>
                      <span>⭐ {viewingModel.rating.toFixed(1)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái:</label>
                      <span>{viewingModel.isPopular ? 'Phổ biến' : 'Không phổ biến'}</span>
                    </div>
                  </div>
                </div>

                {viewingModel.description && (
                  <div className={styles.viewSection}>
                    <h3>Mô tả</h3>
                    <p>{viewingModel.description}</p>
                  </div>
                )}

                <div className={styles.viewSection}>
                  <h3>Thông số kỹ thuật</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Pin:</label>
                      <span>{viewingModel.battery}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tầm hoạt động:</label>
                      <span>{viewingModel.range}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Sạc:</label>
                      <span>{viewingModel.charging}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số chỗ ngồi:</label>
                      <span>{viewingModel.seats}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tốc độ tối đa:</label>
                      <span>{viewingModel.topSpeed}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tăng tốc:</label>
                      <span>{viewingModel.acceleration}</span>
                    </div>
                  </div>
                </div>

                {viewingModel.features && viewingModel.features.length > 0 && (
                  <div className={styles.viewSection}>
                    <h3>Tiện ích</h3>
                    <div className={styles.featureList}>
                      {viewingModel.features.map((feature, index) => (
                        <span key={index} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingModel.highlights && viewingModel.highlights.length > 0 && (
                  <div className={styles.viewSection}>
                    <h3>Điểm nổi bật</h3>
                    <ul className={styles.highlightList}>
                      {viewingModel.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.viewSection}>
                  <h3>Ảnh mẫu xe</h3>
                  {viewingModel.images && viewingModel.images.length > 0 ? (
                    <div className={styles.imageGrid}>
                      {viewingModel.images.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={getImageUrl(imgUrl)}
                          alt={`${viewingModel.name} ${index + 1}`}
                          className={styles.viewImage}
                          onClick={() => window.open(getImageUrl(imgUrl), '_blank')}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/car.png';
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noImage}>Chưa có ảnh</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => setShowViewModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModelManagement;

