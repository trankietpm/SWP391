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
import { VehicleDetail } from '../../data/vehicles';
import { carService } from '../../services/car.service';
import { stationService } from '../../services/station.service';
import styles from './VehicleManagement.module.scss';

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleDetail[]>([]);
  const [stations, setStations] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleImageIds, setVehicleImageIds] = useState<{[key: number]: number[]}>({});
  const [vehicleBatteryStatus, setVehicleBatteryStatus] = useState<{[key: number]: number}>({});
  const [carFiles, setCarFiles] = useState<{[key: number]: string[]}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStation, setFilterStation] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleDetail | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<VehicleDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [featureInput, setFeatureInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formHighlights, setFormHighlights] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const [apiCars, apiStations] = await Promise.all([
        carService.getAllCars(),
        stationService.getAllStations()
      ]);
      
      const imageIdsMap: {[key: number]: number[]} = {};
      const batteryStatusMap: {[key: number]: number} = {};
      const carFilesData: {[key: number]: string[]} = {};
      
      // Fetch car files for all cars using getCarFiles + getImageUrl
      for (const car of apiCars) {
        try {
          const files = await carService.getCarFiles(car.id);
          carFilesData[car.id] = files.map(file => carService.getImageUrl(file.directus_files_id));
        } catch (error) {
          console.error(`Error fetching files for car ${car.id}:`, error);
          carFilesData[car.id] = [];
        }
      }
      
      const mappedVehicles: VehicleDetail[] = apiCars.map(car => {
        const imageUrls = carFilesData[car.id] || [];
        imageIdsMap[car.id] = car.images || [];
        if (car.battery_status !== undefined) {
          batteryStatusMap[car.id] = car.battery_status;
        }
        
        return {
          id: car.id,
          name: car.name,
          type: car.type,
          stationId: car.stationId,
          images: imageUrls,
          price: car.price.toString(),
          availableCount: car.availableCount,
          rating: car.rating,
          features: car.features || [],
          isPopular: car.isPopular,
          description: car.description || '',
          battery: car.battery || '',
          range: car.range || '',
          charging: car.charging || '',
          seats: car.seats || '',
          topSpeed: car.topSpeed || '',
          acceleration: car.acceleration || '',
          highlights: car.highlights || []
        };
      });

      setVehicles(mappedVehicles);
      setVehicleImageIds(imageIdsMap);
      setVehicleBatteryStatus(batteryStatusMap);
      setCarFiles(carFilesData);
      setStations(apiStations.map(s => ({ id: s.id, name: s.name })));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || vehicle.type === filterType;
    const matchesStation = filterStation === 'all' || vehicle.stationId === parseInt(filterStation);
    return matchesSearch && matchesType && matchesStation;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      try {
        const success = await carService.deleteCar(id);
        if (success) {
          await fetchVehicles();
        } else {
          alert('Có lỗi xảy ra khi xóa xe');
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Có lỗi xảy ra khi xóa xe');
      }
    }
  };

  const handleEdit = (vehicle: VehicleDetail) => {
    setEditingVehicle(vehicle);
    setFormFeatures([...vehicle.features]);
    setFormHighlights([...vehicle.highlights]);
    setSelectedImages([]);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setFormFeatures([]);
    setFormHighlights([]);
    setSelectedImages([]);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages([...selectedImages, ...fileArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleView = (vehicle: VehicleDetail) => {
    setViewingVehicle(vehicle);
    setShowViewModal(true);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setUploadingImages(true);
      
      // Upload images and get file IDs
      const imageIds: number[] = [];
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          try {
            const fileId = await carService.uploadFile(image);
            imageIds.push(parseInt(fileId));
          } catch (error) {
            console.error('Error uploading image:', error);
            alert(`Lỗi khi upload ảnh: ${image.name}`);
          }
        }
      }

      // If editing, keep existing image IDs, otherwise use uploaded images
      const existingImageIds = editingVehicle?.id && vehicleImageIds[editingVehicle.id]
        ? vehicleImageIds[editingVehicle.id]
        : [];
      const finalImageIds: number[] = existingImageIds.length > 0 
        ? [...existingImageIds, ...imageIds]
        : imageIds;

      const data = {
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        price: parseFloat((formData.get('price') as string).replace(/,/g, '')) || 0,
        rating: parseFloat(formData.get('rating') as string) || 0,
        availableCount: parseInt(formData.get('availableCount') as string) || 0,
        isPopular: formData.get('isPopular') === 'true',
        description: formData.get('description') as string || '',
        stationId: parseInt(formData.get('stationId') as string) || 0,
        battery: formData.get('battery') as string || '',
        range: formData.get('range') as string || '',
        charging: formData.get('charging') as string || '',
        seats: formData.get('seats') as string || '',
        topSpeed: formData.get('topSpeed') as string || '',
        acceleration: formData.get('acceleration') as string || '',
        features: formFeatures,
        highlights: formHighlights,
        images: finalImageIds,
        battery_status: formData.get('battery_status') ? parseInt(formData.get('battery_status') as string) : undefined
      };

      if (editingVehicle) {
        await carService.updateCar(editingVehicle.id, data);
      } else {
        await carService.createCar(data);
      }
      
      await fetchVehicles();
      setShowModal(false);
      setEditingVehicle(null);
      setFormFeatures([]);
      setFormHighlights([]);
      setSelectedImages([]);
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Có lỗi xảy ra khi lưu xe');
    } finally {
      setUploadingImages(false);
    }
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
        <h1>Quản lý xe</h1>
        <button className={styles.addBtn} onClick={handleAddNew}>
          <PlusOutlined />
          Thêm xe mới
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterBox}>
          <FilterOutlined />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại xe</option>
            <option value="Ô tô điện">Ô tô điện</option>
            <option value="Xe máy điện">Xe máy điện</option>
          </select>
        </div>
        
        <div className={styles.filterBox}>
          <FilterOutlined />
          <select
            value={filterStation}
            onChange={(e) => setFilterStation(e.target.value)}
          >
            <option value="all">Tất cả trạm</option>
            {stations.map(station => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên xe</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Tình trạng pin</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td className={styles.vehicleName}>{vehicle.name}</td>
                <td>
                  <span className={`${styles.typeTag} ${vehicle.type === 'Ô tô điện' ? styles.car : styles.motorcycle}`}>
                    {vehicle.type}
                  </span>
                </td>
                <td className={styles.price}>{vehicle.price} VNĐ/ngày</td>
                <td>
                  <div 
                    className={styles.batteryStatus}
                    data-level={
                      vehicleBatteryStatus[vehicle.id] 
                        ? vehicleBatteryStatus[vehicle.id] >= 70 
                          ? 'high' 
                          : vehicleBatteryStatus[vehicle.id] >= 30 
                            ? 'medium' 
                            : 'low'
                        : 'unknown'
                    }
                  >
                    {vehicleBatteryStatus[vehicle.id] 
                      ? `${vehicleBatteryStatus[vehicle.id]}%` 
                      : 'Chưa cập nhật'
                    }
                  </div>
                </td>
                <td className={styles.availableCount}>
                  {vehicle.availableCount} xe
                </td>
                <td>
                  <span className={`${styles.status} ${vehicle.isPopular ? styles.popular : styles.normal}`}>
                    {vehicle.isPopular ? 'Phổ biến' : 'Bình thường'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleView(vehicle)}
                      title="Xem chi tiết"
                    >
                      <EyeOutlined />
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(vehicle)}
                      title="Chỉnh sửa"
                    >
                      <EditOutlined />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(vehicle.id)}
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

      {filteredVehicles.length === 0 && (
        <div className={styles.emptyState}>
          <p>Không tìm thấy xe nào phù hợp</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} trong {filteredVehicles.length} xe
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

       {/* Modal for Add/Edit Vehicle */}
       {showModal && (
         <div className={styles.modal}>
           <div className={styles.modalContent}>
             <div className={styles.modalHeader}>
               <h2>{editingVehicle ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</h2>
             </div>
             
             <div className={styles.modalBody}>
               <form className={styles.form} onSubmit={handleSubmit}>
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Tên xe *</label>
                   <input 
                     type="text" 
                     name="name"
                     defaultValue={editingVehicle?.name || ''}
                     placeholder="Nhập tên xe"
                     required
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Loại xe *</label>
                   <select name="type" defaultValue={editingVehicle?.type || ''} required>
                     <option value="">Chọn loại xe</option>
                     <option value="Ô tô điện">Ô tô điện</option>
                     <option value="Xe máy điện">Xe máy điện</option>
                   </select>
                 </div>
               </div>
               
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Trạm *</label>
                   <select name="stationId" defaultValue={editingVehicle?.stationId || ''} required>
                     <option value="">Chọn trạm</option>
                     {stations.map(station => (
                       <option key={station.id} value={station.id}>{station.name}</option>
                     ))}
                   </select>
                 </div>
                 <div className={styles.formGroup}>
                   <label>Tình trạng pin (%)</label>
                   <input 
                     type="number" 
                     name="battery_status"
                     min="0"
                     max="100"
                     defaultValue={editingVehicle?.id ? vehicleBatteryStatus[editingVehicle.id] || '' : ''}
                     placeholder="Nhập tình trạng pin (0-100)"
                   />
                 </div>
               </div>
               
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Giá (VNĐ/ngày) *</label>
                   <input 
                     type="text" 
                     name="price"
                     defaultValue={editingVehicle?.price || ''}
                     placeholder="Nhập giá"
                     required
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Đánh giá</label>
                   <input 
                     type="number" 
                     name="rating"
                     step="0.1"
                     min="0"
                     max="5"
                     defaultValue={editingVehicle?.rating || ''}
                     placeholder="Nhập đánh giá (0-5)"
                   />
                 </div>
               </div>
               
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Số lượng *</label>
                   <input 
                     type="number" 
                     name="availableCount"
                     defaultValue={editingVehicle?.availableCount || ''}
                     placeholder="Nhập số lượng"
                     min="0"
                     required
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Trạng thái</label>
                   <select name="isPopular" defaultValue={editingVehicle?.isPopular ? 'true' : 'false'}>
                     <option value="false">Bình thường</option>
                     <option value="true">Phổ biến</option>
                   </select>
                 </div>
               </div>
               
               <div className={styles.formGroup}>
                 <label>Mô tả</label>
                 <textarea 
                   name="description"
                   defaultValue={editingVehicle?.description || ''}
                   placeholder="Nhập mô tả xe"
                   rows={3}
                 />
               </div>
               
               {/* Images */}
               <div className={styles.formGroup}>
                 <label>Ảnh xe</label>
                 <input 
                   type="file" 
                   accept="image/*"
                   multiple
                   onChange={handleImageChange}
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
                           onClick={() => removeImage(index)}
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
                 {editingVehicle && editingVehicle.images && editingVehicle.images.length > 0 && (
                   <div style={{ marginTop: '10px' }}>
                     <p style={{ marginBottom: '5px', fontSize: '12px', color: '#666' }}>Ảnh hiện tại:</p>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                       {editingVehicle.images.map((imgUrl, index) => (
                         <img
                           key={index}
                           src={imgUrl}
                           alt={`Current ${index}`}
                           style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                         />
                       ))}
                     </div>
                   </div>
                 )}
               </div>
               
               {/* Specifications */}
               <div className={styles.sectionTitle}>Thông số kỹ thuật</div>
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Pin</label>
                   <input 
                     type="text" 
                     name="battery"
                     defaultValue={editingVehicle?.battery || ''}
                     placeholder="Ví dụ: Pin Lithium-ion 87.7 kWh"
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Tầm hoạt động</label>
                   <input 
                     type="text" 
                     name="range"
                     defaultValue={editingVehicle?.range || ''}
                     placeholder="Ví dụ: 400km (WLTP)"
                   />
                 </div>
               </div>
               
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Sạc</label>
                   <input 
                     type="text" 
                     name="charging"
                     defaultValue={editingVehicle?.charging || ''}
                     placeholder="Ví dụ: Sạc nhanh DC 150kW"
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Số chỗ ngồi</label>
                   <input 
                     type="text" 
                     name="seats"
                     defaultValue={editingVehicle?.seats || ''}
                     placeholder="Ví dụ: 5 chỗ ngồi"
                   />
                 </div>
               </div>
               
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Tốc độ tối đa</label>
                   <input 
                     type="text" 
                     name="topSpeed"
                     defaultValue={editingVehicle?.topSpeed || ''}
                     placeholder="Ví dụ: 200 km/h"
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Tăng tốc</label>
                   <input 
                     type="text" 
                     name="acceleration"
                     defaultValue={editingVehicle?.acceleration || ''}
                     placeholder="Ví dụ: 0-100 km/h trong 5.5 giây"
                   />
                 </div>
               </div>
               
               {/* Features */}
               <div className={styles.formGroup}>
                 <label>Tiện ích</label>
                 <div className={styles.servicesInput}>
                   <input
                     type="text"
                     value={featureInput}
                     onChange={(e) => setFeatureInput(e.target.value)}
                     placeholder="Nhập tiện ích và nhấn Enter"
                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
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
               
               {/* Highlights */}
               <div className={styles.formGroup}>
                 <label>Điểm nổi bật</label>
                 <div className={styles.servicesInput}>
                   <input
                     type="text"
                     value={highlightInput}
                     onChange={(e) => setHighlightInput(e.target.value)}
                     placeholder="Nhập điểm nổi bật và nhấn Enter"
                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
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
               </form>
             </div>
             
             <div className={styles.modalFooter}>
               <button 
                 type="button" 
                 className={styles.cancelBtn}
                 onClick={() => setShowModal(false)}
               >
                 Hủy
               </button>
               <button 
                 type="button" 
                 className={styles.saveBtn} 
                 disabled={uploadingImages}
                 onClick={() => {
                   const form = document.querySelector('form') as HTMLFormElement;
                   if (form) form.requestSubmit();
                 }}
               >
                 {uploadingImages ? 'Đang tải ảnh...' : (editingVehicle ? 'Cập nhật' : 'Thêm mới')}
               </button>
             </div>
          </div>
        </div>
      )}

      {/* View Vehicle Modal */}
      {showViewModal && viewingVehicle && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết xe: {viewingVehicle.name}</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.viewContent}>
                <div className={styles.viewSection}>
                  <h3>Thông tin cơ bản</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Tên xe:</label>
                      <span>{viewingVehicle.name}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Loại xe:</label>
                      <span>{viewingVehicle.type}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Giá:</label>
                      <span>{viewingVehicle.price} VNĐ/ngày</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Đánh giá:</label>
                      <span>⭐ {viewingVehicle.rating}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số lượng:</label>
                      <span>{viewingVehicle.availableCount} xe</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái:</label>
                      <span>{viewingVehicle.isPopular ? 'Phổ biến' : 'Bình thường'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Mô tả</h3>
                  <p>{viewingVehicle.description}</p>
                </div>

                <div className={styles.viewSection}>
                  <h3>Ảnh xe</h3>
                  {carFiles[viewingVehicle.id] && carFiles[viewingVehicle.id].length > 0 ? (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '10px',
                      maxWidth: '100%'
                    }}>
                      {carFiles[viewingVehicle.id].map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`${viewingVehicle.name} ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '150px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(imgUrl, '_blank')}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/car.png';
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có ảnh</p>
                  )}
                </div>

                <div className={styles.viewSection}>
                  <h3>Thông số kỹ thuật</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Pin:</label>
                      <span>{viewingVehicle.battery}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tình trạng pin:</label>
                      <span>
                        {viewingVehicle.id && vehicleBatteryStatus[viewingVehicle.id] 
                          ? `${vehicleBatteryStatus[viewingVehicle.id]}%` 
                          : 'Chưa cập nhật'
                        }
                      </span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tầm hoạt động:</label>
                      <span>{viewingVehicle.range}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Sạc:</label>
                      <span>{viewingVehicle.charging}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số chỗ ngồi:</label>
                      <span>{viewingVehicle.seats}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tốc độ tối đa:</label>
                      <span>{viewingVehicle.topSpeed}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tăng tốc:</label>
                      <span>{viewingVehicle.acceleration}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Tiện ích</h3>
                  <div className={styles.featureList}>
                    {viewingVehicle.features.map((feature, index) => (
                      <span key={index} className={styles.featureTag}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Điểm nổi bật</h3>
                  <ul className={styles.highlightList}>
                    {viewingVehicle.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
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

export default VehicleManagement;
