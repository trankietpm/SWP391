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
import { vehicleService, getImageUrl } from '../../services/vehicle.service';
import { vehicleModelService } from '../../services/vehicle-model.service';
import { stationService } from '../../services/station.service';
import styles from './VehicleManagement.module.scss';

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleDetail[]>([]);
  const [stations, setStations] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleExtraData, setVehicleExtraData] = useState<{
    [key: number]: {
      batteryStatus?: number;
      status?: 'available' | 'rented' | 'maintenance';
      licensePlate?: string;
      stationId?: number;
    }
  }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStation, setFilterStation] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleDetail | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<VehicleDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [vehicleModels, setVehicleModels] = useState<{ id: number; name: string; type: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const [apiVehicles, apiStations, apiModels] = await Promise.all([
        vehicleService.getAllVehicles(),
        stationService.getAllStations(),
        vehicleModelService.getAllVehicleModels()
      ]);
      
      const detailsMap: {
        [key: number]: {
          batteryStatus?: number;
          status?: 'available' | 'rented' | 'maintenance';
          licensePlate?: string;
        }
      } = {};
      const modelMap = new Map(apiModels.map(m => [m.id, m]));
      
      const mappedVehicles: VehicleDetail[] = apiVehicles.map(vehicle => {
        const model = modelMap.get(vehicle.vehicle_model_id);
        const imageUrls = vehicle.images?.map(img => getImageUrl(img)) || [];
        
        detailsMap[vehicle.id] = {
          ...(vehicle.battery_status !== undefined && { batteryStatus: vehicle.battery_status }),
          ...(vehicle.status && { status: vehicle.status }),
          ...(vehicle.license_plate && { licensePlate: vehicle.license_plate }),
          ...(vehicle.station_id && { stationId: vehicle.station_id }),
        };
        
        return {
          id: vehicle.id,
          name: model?.name || `Vehicle ${vehicle.id}`,
          type: model?.type || 'Ô tô điện',
          stationId: vehicle.station_id,
          images: imageUrls,
          price: model?.price.toString() || '0',
          availableCount: 1,
          rating: model?.rating || 0,
          features: model?.features || [],
          isPopular: model?.isPopular || false,
          description: model?.description || '',
          battery: model?.battery || '',
          range: model?.range || '',
          charging: model?.charging || '',
          seats: model?.seats || '',
          topSpeed: model?.topSpeed || '',
          acceleration: model?.acceleration || '',
          highlights: model?.highlights || []
        };
      });

      setVehicles(mappedVehicles);
      setVehicleExtraData(detailsMap);
      setStations(apiStations.map(s => ({ id: s.id, name: s.name })));
      setVehicleModels(apiModels.map(m => ({ id: m.id, name: m.name, type: m.type })));
      
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
        const success = await vehicleService.deleteVehicle(id);
        if (success) {
          await fetchVehicles();
        } else {
          alert('Có lỗi xảy ra khi xóa xe');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Có lỗi xảy ra khi xóa xe');
      }
    }
  };

  const handleEdit = async (vehicle: VehicleDetail) => {
    try {
      const vehicleData = await vehicleService.getVehicleById(vehicle.id);
      setEditingVehicle(vehicle);
      setCurrentImages([...(vehicleData.images || [])]);
      setSelectedImages([]);
      setShowModal(true);
      // Set form values after modal opens
      setTimeout(() => {
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          const modelIdInput = form.querySelector('[name="vehicle_model_id"]') as HTMLSelectElement;
          const stationInput = form.querySelector('[name="stationId"]') as HTMLSelectElement;
          const licenseInput = form.querySelector('[name="license_plate"]') as HTMLInputElement;
          const batteryInput = form.querySelector('[name="battery_status"]') as HTMLInputElement;
          const statusInput = form.querySelector('[name="status"]') as HTMLSelectElement;
          
          if (modelIdInput) modelIdInput.value = vehicleData.vehicle_model_id.toString();
          if (stationInput) stationInput.value = vehicleData.station_id.toString();
          if (licenseInput) licenseInput.value = vehicleData.license_plate || '';
          if (batteryInput) batteryInput.value = vehicleData.battery_status.toString();
          if (statusInput) {
            statusInput.value = vehicleData.status;
          }
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      alert('Không thể tải thông tin xe');
    }
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setSelectedImages([]);
    setCurrentImages([]);
    setShowModal(true);
  };

  const resizeImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleRemoveCurrentImage = (indexToRemove: number) => {
    setCurrentImages(currentImages.filter((_, index) => index !== indexToRemove));
  };

  const handleView = (vehicle: VehicleDetail) => {
    setViewingVehicle(vehicle);
    setShowViewModal(true);
  };

  const getStatusLabel = (status: 'available' | 'rented' | 'maintenance' | undefined): string => {
    if (!status) return 'Chưa xác định';
    switch (status) {
      case 'available': return 'Sẵn sàng';
      case 'rented': return 'Đang thuê';
      case 'maintenance': return 'Bảo trì';
      default: return 'Chưa xác định';
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setUploadingImages(true);
      
      const base64Images: string[] = [];
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          try {
            const base64 = await resizeImage(image);
            base64Images.push(base64);
          } catch (error) {
            console.error('Error processing image:', error);
            alert(`Lỗi khi xử lý ảnh: ${image.name}`);
          }
        }
      }

      const vehicleData = {
        vehicle_model_id: parseInt(formData.get('vehicle_model_id') as string) || 0,
        station_id: parseInt(formData.get('stationId') as string) || 0,
        battery_status: formData.get('battery_status') ? parseInt(formData.get('battery_status') as string) : 0,
        license_plate: (formData.get('license_plate') as string) || '',
        status: ((formData.get('status') as string)?.toLowerCase() || 'available') as 'available' | 'rented' | 'maintenance',
        ...(base64Images.length > 0 && { base64Images }),
        ...(editingVehicle && currentImages.length > 0 && { images: currentImages }),
      };

      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await vehicleService.createVehicle(vehicleData);
      }
      
      await fetchVehicles();
      setShowModal(false);
      setEditingVehicle(null);
      setSelectedImages([]);
      setCurrentImages([]);
    } catch (error) {
      console.error('Error saving vehicle:', error);
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
              <th>Giá</th>
              <th>Tình trạng pin</th>
              <th>Biển số xe</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td className={styles.vehicleName}>{vehicle.name}</td>
                <td className={styles.price}>{Number(vehicle.price).toLocaleString('vi-VN')} VNĐ/ngày</td>
                <td>
                  <div 
                    className={styles.batteryStatus}
                    data-level={
                      vehicleExtraData[vehicle.id]?.batteryStatus !== undefined
                        ? vehicleExtraData[vehicle.id]!.batteryStatus! >= 70 
                          ? 'high' 
                          : vehicleExtraData[vehicle.id]!.batteryStatus! >= 30 
                            ? 'medium' 
                            : 'low'
                        : 'unknown'
                    }
                  >
                    {vehicleExtraData[vehicle.id]?.batteryStatus !== undefined
                      ? `${vehicleExtraData[vehicle.id]!.batteryStatus}%` 
                      : 'Chưa cập nhật'
                    }
                  </div>
                </td>
                <td className={styles.licensePlate}>
                  {vehicleExtraData[vehicle.id]?.licensePlate || '-'}
                </td>
                <td>
                  <span className={`${styles.status} ${
                    vehicleExtraData[vehicle.id]?.status === 'available' ? styles.available :
                    vehicleExtraData[vehicle.id]?.status === 'rented' ? styles.rented :
                    vehicleExtraData[vehicle.id]?.status === 'maintenance' ? styles.maintenance :
                    styles.normal
                  }`}>
                    {vehicleExtraData[vehicle.id]?.status === 'available' ? 'Sẵn sàng' :
                     vehicleExtraData[vehicle.id]?.status === 'rented' ? 'Đang thuê' :
                     vehicleExtraData[vehicle.id]?.status === 'maintenance' ? 'Bảo trì' :
                     'Chưa xác định'}
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
                   <label>Mẫu xe *</label>
                   <select name="vehicle_model_id" required>
                     <option value="">Chọn mẫu xe</option>
                     {vehicleModels.map(model => (
                       <option key={model.id} value={model.id}>
                         {model.name} ({model.type})
                       </option>
                     ))}
                   </select>
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Trạm *</label>
                   <select name="stationId" required>
                     <option value="">Chọn trạm</option>
                     {stations.map(station => (
                       <option key={station.id} value={station.id}>{station.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
               
               <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                   <label>Biển số xe *</label>
                   <input 
                     type="text" 
                     name="license_plate"
                     placeholder="Nhập biển số xe"
                     required
                   />
                 </div>
                 
                 <div className={styles.formGroup}>
                   <label>Tình trạng pin (%) *</label>
                   <input 
                     type="number" 
                     name="battery_status"
                     min="0"
                     max="100"
                     defaultValue={editingVehicle?.id ? vehicleExtraData[editingVehicle.id]?.batteryStatus || 100 : 100}
                     placeholder="Nhập tình trạng pin (0-100)"
                     required
                   />
                 </div>
               </div>
               
               {editingVehicle && (
                 <div className={styles.formRow}>
                   <div className={styles.formGroup}>
                     <label>Trạng thái *</label>
                     <select name="status" required>
                       <option value="available">Sẵn sàng</option>
                       <option value="rented">Đang thuê</option>
                       <option value="maintenance">Bảo trì</option>
                     </select>
                   </div>
                 </div>
               )}

               <div className={styles.formGroup}>
                 <label>Ảnh xe</label>
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
                 {uploadingImages ? 'Đang lưu...' : editingVehicle ? 'Cập nhật' : 'Thêm mới'}
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
              <h2>Chi tiết xe</h2>
              <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.viewContent}>
                <div className={styles.viewSection}>
                  <h3>Thông tin xe</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Biển số xe:</label>
                      <span>{vehicleExtraData[viewingVehicle.id]?.licensePlate || '-'}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạm xe:</label>
                      <span>
                        {(() => {
                          const stationId = vehicleExtraData[viewingVehicle.id]?.stationId || viewingVehicle.stationId;
                          const station = stations.find(s => s.id === stationId);
                          return station?.name || 'Chưa xác định';
                        })()}
                      </span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tình trạng pin:</label>
                      <span>
                        {viewingVehicle.id && vehicleExtraData[viewingVehicle.id]?.batteryStatus !== undefined
                          ? `${vehicleExtraData[viewingVehicle.id]!.batteryStatus}%` 
                          : 'Chưa cập nhật'
                        }
                      </span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái:</label>
                      <span>{getStatusLabel(viewingVehicle.id ? vehicleExtraData[viewingVehicle.id]?.status : undefined)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Thông tin mẫu xe</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Tên mẫu xe:</label>
                      <span>{viewingVehicle.name}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Loại xe:</label>
                      <span>{viewingVehicle.type}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Giá thuê:</label>
                      <span>{Number(viewingVehicle.price).toLocaleString('vi-VN')} VNĐ/ngày</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Đánh giá:</label>
                      <span>⭐ {viewingVehicle.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Ảnh mẫu xe</h3>
                  {viewingVehicle.images && viewingVehicle.images.length > 0 ? (
                    <div className={styles.imageGrid}>
                      {viewingVehicle.images.map((imgUrl: string, index: number) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`${viewingVehicle.name} ${index + 1}`}
                          className={styles.viewImage}
                          onClick={() => window.open(imgUrl, '_blank')}
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

export default VehicleManagement;
