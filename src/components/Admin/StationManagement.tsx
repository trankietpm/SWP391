"use client"
import React, { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, FilterOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, UserOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Station } from '../../data/stations';
import { stationService } from '../../services/station.service';
import { vehicleService } from '../../services/vehicle.service';
import styles from './StationManagement.module.scss';

const StationManagement: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [viewingStation, setViewingStation] = useState<Station | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStations = filteredStations.slice(startIndex, endIndex);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    district: '',
    phone: '',
    email: '',
    manager: '',
    capacity: 0,
    status: 'active' as 'active' | 'inactive' | 'maintenance',
    openingHours: '',
    services: [] as string[],
    lat: 0,
    lng: 0,
    description: ''
  });

  const [serviceInput, setServiceInput] = useState('');

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    let filtered = stations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.phone.includes(searchTerm) ||
        station.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(station => station.status === filterStatus);
    }

    // City filter
    if (filterCity !== 'all') {
      filtered = filtered.filter(station => station.city === filterCity);
    }

    setFilteredStations(filtered);
    setCurrentPage(1);
  }, [stations, searchTerm, filterStatus, filterCity]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleCityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCity(e.target.value);
  };

  const handleAdd = () => {
    setEditingStation(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      district: '',
      phone: '',
      email: '',
      manager: '',
      capacity: 0,
      status: 'active',
      openingHours: '',
      services: [],
      lat: 0,
    lng: 0,
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      city: station.city,
      district: station.district,
      phone: station.phone,
      email: station.email,
      manager: station.manager,
      capacity: station.capacity,
      status: station.status,
      openingHours: station.openingHours,
      services: [...station.services],
      lat: Number(station.lat) || 0,
      lng: Number(station.lng) || 0,
      description: station.description
    });
    setShowModal(true);
  };

  const handleView = (station: Station) => {
    setViewingStation(station);
    setShowViewModal(true);
  };

  const fetchStations = async () => {
    try {
      setLoading(true);
      const apiStations = await stationService.getAllStations();
      const mappedStations: Station[] = apiStations.map(station => {
        const dateStr = typeof station.date_created === 'string' 
          ? station.date_created 
          : new Date().toISOString();
        const dateFormatted = dateStr.split('T')[0];
        
        return {
          id: station.id,
          name: station.name,
          address: station.address,
          city: station.city,
          district: station.district,
          phone: station.phone,
          email: station.email,
          manager: station.manager,
          capacity: station.capacity,
          lat: Number(station.lat) || 0,
          lng: Number(station.lng) || 0,
          status: station.status as 'active' | 'inactive' | 'maintenance',
          openingHours: station.openingHours,
          services: station.services || [],
          description: station.description || '',
          createdAt: dateFormatted,
          updatedAt: dateFormatted
        };
      });
      setStations(mappedStations);
      setFilteredStations(mappedStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trạm này?')) {
      try {
        const success = await stationService.deleteStation(id);
        if (success) {
          await fetchStations();
        } else {
          alert('Có lỗi xảy ra khi xóa trạm');
        }
      } catch (error) {
        console.error('Error deleting station:', error);
        alert('Có lỗi xảy ra khi xóa trạm');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStation) {
        await stationService.updateStation(editingStation.id, {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          phone: formData.phone,
          email: formData.email,
          manager: formData.manager,
          capacity: formData.capacity,
          lat: formData.lat,
          lng: formData.lng,
          status: formData.status,
          openingHours: formData.openingHours,
          services: formData.services,
          description: formData.description
        });
      } else {
        await stationService.createStation({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          phone: formData.phone,
          email: formData.email,
          manager: formData.manager,
          capacity: formData.capacity,
          lat: formData.lat,
          lng: formData.lng,
          status: formData.status,
          openingHours: formData.openingHours,
          services: formData.services,
          description: formData.description
        });
      }
      
      await fetchStations();
      setShowModal(false);
      setEditingStation(null);
    } catch (error) {
      console.error('Error saving station:', error);
      alert('Có lỗi xảy ra khi lưu trạm');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const addService = () => {
    if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'inactive':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'maintenance':
        return <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Tạm ngưng';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };

  const getUniqueCities = () => {
    return [...new Set(stations.map(station => station.city))];
  };

  const StationVehicleCount: React.FC<{ stationId: number; capacity: number }> = ({ stationId, capacity }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const fetchCount = async () => {
        try {
          const vehicles = await vehicleService.getVehiclesByStation(stationId);
          const total = vehicles.length; 
          setCount(total);
        } catch (error) {
          console.error('Error fetching vehicle count:', error);
        }
      };
      fetchCount();
    }, [stationId]);
    
    return <>{count}/{capacity}</>;
  };

  const StationUsageRatio: React.FC<{ stationId: number; capacity: number }> = ({ stationId, capacity }) => {
    const [ratio, setRatio] = useState(0);
    
    useEffect(() => {
      const fetchRatio = async () => {
        try {
          const vehicles = await vehicleService.getVehiclesByStation(stationId);
          const total = vehicles.length; // Đếm tất cả xe (available, rented, maintenance)
          setRatio(Math.round((total / capacity) * 100));
        } catch (error) {
          console.error('Error fetching usage ratio:', error);
        }
      };
      fetchRatio();
    }, [stationId, capacity]);
    
    return <>{ratio}%</>;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.stationManagement}>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <LoadingOutlined style={{ fontSize: 48 }} />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stationManagement}>
        <div className={styles.header}>
        <h1>Quản lý trạm thuê xe</h1>
        <button className={styles.addBtn} onClick={handleAdd}>
          <PlusOutlined />
          Thêm trạm mới
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm trạm..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <FilterOutlined />
          <select value={filterStatus} onChange={handleStatusFilter}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm ngưng</option>
            <option value="maintenance">Bảo trì</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <EnvironmentOutlined />
          <select value={filterCity} onChange={handleCityFilter}>
            <option value="all">Tất cả thành phố</option>
            {getUniqueCities().map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên trạm</th>
              <th>Địa chỉ</th>
              <th>Quản lý</th>
              <th>Liên hệ</th>
              <th>Trạng thái</th>
              <th>Xe hiện tại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentStations.map((station) => (
              <tr key={station.id}>
                <td>{station.id}</td>
                <td>
                  <div className={styles.stationInfo}>
                    <EnvironmentOutlined />
                    <div>
                      <div className={styles.stationName}>{station.name}</div>
                      <div className={styles.stationDistrict}>{station.district}, {station.city}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.addressInfo}>
                    <div>{station.address}</div>
                    <div className={styles.coordinates}>
                      {Number(station.lat).toFixed(4)}, {Number(station.lng).toFixed(4)}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.managerInfo}>
                    <UserOutlined />
                    <div>
                      <div>{station.manager}</div>
                      <div className={styles.openingHours}>
                        <ClockCircleOutlined />
                        {station.openingHours}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <PhoneOutlined />
                      {station.phone}
                    </div>
                    <div className={styles.contactItem}>
                      <MailOutlined />
                      {station.email}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.statusInfo}>
                    {getStatusIcon(station.status)}
                    <span>{getStatusText(station.status)}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.vehicleInfo}>
                    <div className={styles.vehicleCount}>
                      <StationVehicleCount stationId={station.id} capacity={station.capacity} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleView(station)}
                      title="Xem chi tiết"
                    >
                      <EyeOutlined />
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(station)}
                      title="Chỉnh sửa"
                    >
                      <EditOutlined />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(station.id)}
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
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredStations.length)} trong {filteredStations.length} trạm
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingStation ? 'Chỉnh sửa trạm' : 'Thêm trạm mới'}</h2>
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
                    <label>Tên trạm *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Quản lý *</label>
                    <input
                      type="text"
                      name="manager"
                      value={formData.manager}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Địa chỉ *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Quận/Huyện *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Thành phố *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn thành phố</option>
                      <option value="TP.HCM">TP.HCM</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Giờ mở cửa *</label>
                    <input
                      type="text"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleInputChange}
                      placeholder="VD: 6:00 - 22:00"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Sức chứa *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Trạng thái</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm ngưng</option>
                      <option value="maintenance">Bảo trì</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Vĩ độ</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                      placeholder="10.7769"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Kinh độ</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                      placeholder="106.7009"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Dịch vụ</label>
                  <div className={styles.servicesInput}>
                    <input
                      type="text"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      placeholder="Nhập dịch vụ và nhấn Enter"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    />
                    <button type="button" onClick={addService}>Thêm</button>
                  </div>
                  <div className={styles.servicesList}>
                    {formData.services.map((service, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {service}
                        <button type="button" onClick={() => removeService(service)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
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
                onClick={handleSubmit}
              >
                {editingStation ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingStation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết trạm</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.viewContent}>
              <div className={styles.viewSection}>
                <h3>Thông tin cơ bản</h3>
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem}>
                    <strong>Tên trạm:</strong> {viewingStation.name}
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Địa chỉ:</strong> {viewingStation.address}
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Khu vực:</strong> {viewingStation.district}, {viewingStation.city}
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Quản lý:</strong> {viewingStation.manager}
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Trạng thái:</strong> 
                    <span className={styles.statusBadge}>
                      {getStatusIcon(viewingStation.status)}
                      {getStatusText(viewingStation.status)}
                    </span>
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Giờ mở cửa:</strong> {viewingStation.openingHours}
                  </div>
                </div>
              </div>

              <div className={styles.viewSection}>
                <h3>Liên hệ</h3>
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem}>
                    <strong>Điện thoại:</strong> {viewingStation.phone}
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Email:</strong> {viewingStation.email}
                  </div>
                </div>
              </div>

              <div className={styles.viewSection}>
                <h3>Thông tin xe</h3>
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem}>
                    <strong>Sức chứa:</strong> {viewingStation.capacity} xe
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Xe hiện tại:</strong> <StationVehicleCount stationId={viewingStation.id} capacity={viewingStation.capacity} /> xe
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Tỷ lệ sử dụng:</strong> <StationUsageRatio stationId={viewingStation.id} capacity={viewingStation.capacity} />
                  </div>
                </div>
              </div>

              <div className={styles.viewSection}>
                <h3>Dịch vụ</h3>
                <div className={styles.servicesList}>
                  {viewingStation.services.map((service, index) => (
                    <span key={index} className={styles.serviceTag}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.viewSection}>
                <h3>Vị trí</h3>
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem}>
                    <strong>Tọa độ:</strong> {viewingStation.lat}, {viewingStation.lng}
                  </div>
                </div>
              </div>

              {viewingStation.description && (
                <div className={styles.viewSection}>
                  <h3>Mô tả</h3>
                  <p>{viewingStation.description}</p>
                </div>
              )}

              <div className={styles.viewSection}>
                <h3>Thông tin hệ thống</h3>
                <div className={styles.viewGrid}>
                  <div className={styles.viewItem}>
                    <strong>Ngày tạo:</strong> {viewingStation.createdAt}
                  </div>
                  <div className={styles.viewItem}>
                    <strong>Cập nhật cuối:</strong> {viewingStation.updatedAt}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default StationManagement;
