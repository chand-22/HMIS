import {Consultation,Feedback} from '../models/consultation.js';
import {Room,DailyOccupancy} from '../models/facility.js';
import LogModels from '../models/logs.js';
import Medicine from '../models/inventory.js';
import BillModels  from '../models/bill.js';
import {Doctor} from '../models/staff.js';
import Department from '../models/department.js';
import {PrescriptionEntry,Prescription} from '../models/consultation.js';

const {Bill,BillItem} = BillModels;
const {MedicineInventoryLog} = LogModels;

export const addMedicine = async (req, res) => {
  try {
    const {
      med_name,
      effectiveness,
      dosage_form,
      manufacturer,
      available,
      inventory
    } = req.body;

    const newMedicine = new Medicine({
      med_name,
      effectiveness,
      dosage_form,
      manufacturer,
      available,
      inventory
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json({ message: 'Medicine added successfully', data: savedMedicine });

  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({ error: 'Failed to add medicine', details: error.message });
  }
};

export const addInventoryLog = async (req, res) => {
  try {
    const {
      med_id,
      quantity,
      total_cost,
      order_date,
      supplier,
      status
    } = req.body;

    const newLog = new MedicineInventoryLog({
      med_id,
      quantity,
      total_cost,
      order_date,
      supplier,
      status
    });

    const savedLog = await newLog.save();
    res.status(201).json({ message: 'Inventory log added successfully', data: savedLog });

  } catch (error) {
    console.error('Error adding inventory log:', error);
    res.status(500).json({ error: 'Failed to add inventory log', details: error.message });
  }
};

export const addItemToBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const itemData = req.body;

    // Step 1: Find the bill
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Step 2: Create a new BillItem document in the collection
    const newBillItem = new BillItem(itemData);
    await newBillItem.save();

    // Step 3: Push the saved BillItem into the Bill's embedded items array
    bill.items.push(newBillItem);
    await bill.save();

    res.status(200).json({ message: 'Item added to bill', bill });
  } catch (error) {
    console.error('Error adding item to bill:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



  export const createBill = async (req, res) => {
    try {
      const billData = req.body;
  
      const newBill = new Bill(billData);
      await newBill.save();
  
      res.status(201).json({ message: 'Bill created successfully', bill: newBill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  export const createPrescription = async (req, res) => {
    try {
      const prescriptionData = req.body;
  
      const newPrescription = new Prescription(prescriptionData);
      await newPrescription.save();
  
      res.status(201).json({ message: 'Prescription created successfully', prescription: newPrescription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

export const addPrescriptionEntry = async (req, res) => {
  try {
    const {
      prescription_id,
      medicine_id,
      dosage,
      frequency,
      duration,
      quantity,
      dispensed_qty = 0
    } = req.body;

    const newEntry = new PrescriptionEntry({
      prescription_id,
      medicine_id,
      dosage,
      frequency,
      duration,
      quantity,
      dispensed_qty
    });

    await newEntry.save();
    res.status(201).json({
      message: 'Prescription entry added successfully',
      data: newEntry
    });

  } catch (error) {
    console.error('Error adding prescription entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to add rating and review
export const addRatingAndReview = async (req, res) => {
    const { consultationId } = req.params; // ID of the consultation
    const { dept_id, rating, comments } = req.body; // Rating and review from the user

    try {
        // Find the consultation by ID
        const consultation = await Consultation.findById(consultationId);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        // Add feedback to the consultation
        consultation.feedback = {
            rating,
            comments,
            created_at: new Date()
        };

        // Save the updated consultation
        await consultation.save();

        // Also add feedback to the Feedback schema
        const newFeedback = new Feedback({
            dept_id,
            rating,
            comments,
            created_at: new Date()
        });

        await newFeedback.save(); // Save feedback in Feedback collection

        res.status(200).json({
            message: 'Feedback added successfully',
            consultationFeedback: consultation.feedback,
            feedbackSchemaEntry: newFeedback
        });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ message: 'Error adding feedback', error });
    }
};

// Function to calculate department-wise rating
export const calculateDepartmentRating = async (req, res) => {
    const { departmentId } = req.params; // ID of the department
    try {
        const consultations = await Consultation.find({ 
            dept_id: departmentId, 
            "feedback.rating": { $exists: true } 
        });

        if (consultations.length === 0) {
            return res.status(200).json({ departmentRating: 0 , consultationlen : 0 });
        }

        const totalRating = consultations.reduce((sum, consultation) => sum + consultation.feedback.rating, 0);
        const departmentRating = totalRating / consultations.length;

        res.status(200).json({ departmentRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating department rating', error });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        // Find all feedback documents
        const feedbacks = await Feedback.find({}); // Retrieve only rating and comments fields

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(200).json({ message: 'No feedbacks found', feedbacks: [] });
        }

        res.status(200).json({
            totalFeedbacks: feedbacks.length,
            feedbacks
        });
    } catch (error) {
        console.error('Error in getAllFeedbacks:', error);
        res.status(500).json({ message: 'Error retrieving feedbacks', error });
    }
};
export const calculateOverallRating = async (req, res) => {
    try {
        // Find all feedback documents with ratings
        const feedbacks = await Feedback.find({ rating: { $exists: true } }, { rating: 1, _id: 0 }); // Retrieve only ratings

        if (!feedbacks || feedbacks.length === 0) {
            return res.status(200).json({ overallRating: 0, totalFeedbacks: 0 });
        }

        // Calculate the total rating and overall average rating
        const totalFeedbacks = feedbacks.length;
        const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        const overallRating = totalRating / totalFeedbacks;

        res.status(200).json({
            overallRating,
            totalFeedbacks
        });
    } catch (error) {
        console.error('Error in getOverallRating:', error);
        res.status(500).json({ message: 'Error calculating overall rating', error });
    }
};

// Function to calculate rating distribution
export const getRatingDistribution = async () => {
    const consultations = await Feedback.find({ "feedback.rating": { $exists: true } });

    const distribution = consultations.reduce((acc, consultation) => {
        const rating = consultation.feedback.rating;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
    }, {});

    return { ratingDistribution: distribution };
};

export const getBedOccupancyTrends = async (req, res) => {
    const { period } = req.params; // e.g., daily, weekly, monthly, yearly

    try {
        // Parse and normalize dates from query parameters
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        startDate.setHours(0, 0, 0, 0); // Set startDate to start of the day
        endDate.setHours(23, 59, 59, 999); // Set endDate to end of the day

        // Validate input dates
        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ message: 'Invalid date format. Please provide valid startDate and endDate.' });
        }
        if (startDate > endDate) {
            return res.status(400).json({ message: 'startDate cannot be later than endDate.' });
        }

        // Fetch all DailyOccupancy entries within the given date range
        const occupancyEntries = await DailyOccupancy.find({
            date: { $gte: startDate, $lte: endDate }
        });

        let trends = []; // Placeholder for results
        if (period === 'daily') {
            // Return the count of occupied beds for each day
            trends = occupancyEntries.map(entry => ({
                date: entry.date,
                occupiedBedCount: entry.occupiedBeds.length
            }));
        } else if (period === 'weekly') {
            // Aggregate occupied bed counts by week (Monday-Sunday)
            const weekTrends = {};
            occupancyEntries.forEach(entry => {
                const weekStart = getStartOfWeek(entry.date); // Calculate the start of the week
                if (!weekTrends[weekStart]) {
                    weekTrends[weekStart] = { weekStart, occupiedBedCount: 0 };
                }
                weekTrends[weekStart].occupiedBedCount += entry.occupiedBeds.length;
            });
            trends = Object.values(weekTrends);
        } else if (period === 'monthly') {
            // Aggregate occupied bed counts by month
            const monthTrends = {};
            occupancyEntries.forEach(entry => {
                const monthStart = getStartOfMonth(entry.date); // Calculate the start of the month
                if (!monthTrends[monthStart]) {
                    monthTrends[monthStart] = { monthStart, occupiedBedCount: 0 };
                }
                monthTrends[monthStart].occupiedBedCount += entry.occupiedBeds.length;
            });
            trends = Object.values(monthTrends);
        } else if (period === 'yearly') {
            // Aggregate occupied bed counts by year
            const yearTrends = {};
            occupancyEntries.forEach(entry => {
                const yearStart = getStartOfYear(entry.date); // Calculate the start of the year
                if (!yearTrends[yearStart]) {
                    yearTrends[yearStart] = { yearStart, occupiedBedCount: 0 };
                }
                yearTrends[yearStart].occupiedBedCount += entry.occupiedBeds.length;
            });
            trends = Object.values(yearTrends);
        } else {
            // Handle invalid period input
            return res.status(400).json({ message: 'Invalid period. Please provide one of daily, weekly, monthly, or yearly.' });
        }

        // Send successful response
        res.status(200).json({
            occupancyEntries,
            period,
            startDate,
            endDate,
            trends
        });
    } catch (error) {
        console.error('Error calculating bed occupancy trends:', error);
        res.status(500).json({ message: 'Error calculating bed occupancy trends', error });
    }
};

// Helper Functions
const getStartOfWeek = date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday start
    return new Date(d.setDate(diff)).toISOString().split('T')[0]; // Return as YYYY-MM-DD
};

const getStartOfMonth = date => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]; // YYYY-MM-DD
};

const getStartOfYear = date => {
    const d = new Date(date);
    return new Date(d.getFullYear(), 0, 1).toISOString().split('T')[0]; // YYYY-MM-DD
};
// Function to return overall statistics (total beds, total rooms)
export const getFacilityStatistics = async (req, res) => {
    try {
        const rooms = await Room.find({});
        const totalRooms = rooms.length;
        let totalBeds = 0;
        rooms.forEach(room => {
            totalBeds += room.beds.length;
        });

        res.json({ totalRooms, totalBeds,rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching facility statistics', error });
    }
};

export const updateDailyOccupancy = async () => {
    try {
        const today = new Date();
        const todayDate = new Date(today.setHours(0, 0, 0, 0)); // Normalize to midnight

        // Find all beds with 'occupied' status
        const rooms = await Room.find({
            "beds.status": "occupied",
            "occupancy_start_date": { $lt: today } // Filter for occupancy_start_date before today
        });
        
        const occupiedBedIds = [];
        rooms.forEach(room => {
            room.beds.forEach(bed => {
                if (bed.status === "occupied") {
                    occupiedBedIds.push(bed._id); // Collect all occupied bed IDs
                }
            });
        });

        // Insert or update today's entry in DailyOccupancy schema
        const existingEntry = await DailyOccupancy.findOne({ date: todayDate });

        if (existingEntry) {
            // Update the entry if it exists
            existingEntry.occupiedBeds = occupiedBedIds;
            await existingEntry.save();
            console.log('Daily occupancy updated for:', todayDate);
        } else {
            // Create a new entry for the day
            const newEntry = new DailyOccupancy({
                date: todayDate,
                occupiedBeds: occupiedBedIds
            });
            await newEntry.save();
            console.log('Daily occupancy created for:', todayDate);
        }
    } catch (error) {
        console.error('Error updating daily occupancy:', error);
    }
};


export const getMedicineInventoryTrends = async (req, res) => {
  try {
    const { medicineId, startDate, endDate } = req.body;
    const medId = parseInt(medicineId);

    if (isNaN(medId)) {
    return res.status(400).json({ message: 'Invalid medicineId' });
    }
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
 
    // Query MedicineInventoryLog for the specified medicine and date range
    const inventoryLogs = await MedicineInventoryLog.aggregate([
      {
        $match: {
          med_id: medId,
          order_date: { $gte: start, $lte: end },
          status: "received"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$order_date" },
            month: { $month: "$order_date" }
          },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);
 
    // Format monthly data
    const monthLabels = [];
    const monthValues = [];
 
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    inventoryLogs.forEach(item => {
      const monthName = monthNames[item._id.month - 1];
      monthLabels.push(`${monthName} ${item._id.year}`);
      monthValues.push(item.totalQuantity);
    });
 
    // Get weekly data for each month
    const weeklyDataByMonth = {};
 
    for (const monthLabel of monthLabels) {
      const [month, year] = monthLabel.split(' ');
      const monthIndex = monthNames.indexOf(month);
 
      // Find first and last day of the month
      const firstDay = new Date(parseInt(year), monthIndex, 1);
      const lastDay = new Date(parseInt(year), monthIndex + 1, 0);
 
      // Group by week within month
      const weeklyData = await MedicineInventoryLog.aggregate([
        {
          $match: {
            med_id: parseInt(medicineId),
            order_date: { $gte: firstDay, $lte: lastDay },
            status: "received"
          }
        },
        {
          $project: {
            week: { $ceil: { $divide: [{ $dayOfMonth: "$order_date" }, 7] } },
            quantity: 1
          }
        },
        {
          $group: {
            _id: "$week",
            totalQuantity: { $sum: "$quantity" }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);
 
      // Format weekly data
      const weekLabels = [];
      const weekValues = [];
 
      weeklyData.forEach((item) => {
        weekLabels.push(`Week ${item._id}`);
        weekValues.push(item.totalQuantity);
      });
 
      weeklyDataByMonth[monthLabel] = {
        labels: weekLabels,
        values: weekValues
      };
    }
 
    // Get medicine details
    const medicine = await Medicine.findOne({ _id: medId });
 
    if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
    }

    // Calculate total orders
    const totalOrders = monthValues.reduce((sum, val) => sum + val, 0);

    // Return formatted data
    res.json({
      medicine: {
        id: medicine._id.toString(),
        name: medicine.med_name
          
      },
      monthlyData: {
        labels: monthLabels,
        values: monthValues
      },
      weeklyDataByMonth,
      totalOrders
    });
 
  } catch (error) {
    console.error('Error fetching medicine inventory trends:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMedicinePrescriptionTrends = async (req, res) => {
    try {
      const { medicineId, startDate, endDate } = req.body;
      const medId = parseInt(medicineId);
      if (isNaN(medId)) {
        return res.status(400).json({ message: 'Invalid medicineId' });
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const bills = await Bill.find({
        generation_date: { $gte: start, $lte: end }
      });
  
      const monthlyData = {};
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      for (const bill of bills) {
  
        const billItems = bill.items.filter(item => item.item_type === "medication");
  
        for (const item of billItems) {
          if (item.prescription_id) {
           
            const prescription = await Prescription.findOne({ _id: item.prescription_id });
            if (prescription && Array.isArray(prescription.entries)) {
                //  Filter only entries matching medicineId from the embedded entries array
                const prescriptionEntries = prescription.entries.filter(
                entry => entry.medicine_id === medId
                );
            const dispensedQty = prescriptionEntries.reduce((sum, entry) => sum + entry.dispensed_qty, 0);
            if (dispensedQty > 0) {
              const date = new Date(bill.generation_date);
              const year = date.getFullYear();
              const month = date.getMonth();
              const monthLabel = `${monthNames[month]} ${year}`;
  
              if (!monthlyData[monthLabel]) {
                monthlyData[monthLabel] = {
                  count: 0,
                  quantity: 0,
                  weeklyData: {}
                };
              }
  
              monthlyData[monthLabel].count += 1;
              monthlyData[monthLabel].quantity += dispensedQty;
  
              const weekNum = Math.ceil(date.getDate() / 7);
              const weekKey = `Week ${weekNum}`;
  
              if (!monthlyData[monthLabel].weeklyData[weekKey]) {
                monthlyData[monthLabel].weeklyData[weekKey] = {
                  count: 0,
                  quantity: 0
                };
              }
  
              monthlyData[monthLabel].weeklyData[weekKey].count += 1;
              monthlyData[monthLabel].weeklyData[weekKey].quantity += dispensedQty;
  
            }
          }
        }
        }
      }
  
      const monthLabels = [];
      const monthValues = [];
      const weeklyDataByMonth = {};
  
      const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        if (yearA !== yearB) {
          return parseInt(yearA) - parseInt(yearB);
        }
        return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
      });
  
      for (const monthKey of sortedMonths) {
        monthLabels.push(monthKey);
        monthValues.push(monthlyData[monthKey].quantity);
  
        const weeklyLabels = [];
        const weeklyValues = [];
  
        const weekKeys = Object.keys(monthlyData[monthKey].weeklyData).sort((a, b) => {
          return parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]);
        });
  
        for (const weekKey of weekKeys) {
          weeklyLabels.push(weekKey);
          weeklyValues.push(monthlyData[monthKey].weeklyData[weekKey].quantity);
        }
  
        weeklyDataByMonth[monthKey] = {
          labels: weeklyLabels,
          values: weeklyValues
        };
  
      }
  
      const medicine = await Medicine.findById(medId);
      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found with given ID.' });
      }
  
      const totalPrescriptionsQuantity = monthValues.reduce((sum, val) => sum + val, 0);
     res.json({
        medicine: {
          id: medicine._id.toString(),
          name: medicine.med_name
        },
        monthlyData: {
          labels: monthLabels,
          values: monthValues
        },
        weeklyDataByMonth,
        totalPrescriptionsQuantity
      });
  
    } catch (error) {
      console.error('[ERROR] Error fetching medicine prescription trends:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

export const getDoctorRatingDistribution = async (req, res) => {
    try {
      // Define the rating ranges
      const ratingRanges = [
        { min: 1.5, max: 2.2, label: '1.5-2.2' },
        { min: 2.2, max: 2.9, label: '2.2-2.9' },
        { min: 2.9, max: 3.6, label: '2.9-3.6' },
        { min: 3.6, max: 4.3, label: '3.6-4.3' },
        { min: 4.3, max: 5.0, label: '4.3-5.0' }
      ];
  
      // Initialize result object
      const distribution = {};
      
      // Populate with initial zero counts
      ratingRanges.forEach(range => {
        distribution[range.label] = 0;
      });
  
      // Get all doctors
      const doctors = await Doctor.find({}, { rating: 1 });
      
      // Count doctors in each range
      doctors.forEach(doctor => {
        for (const range of ratingRanges) {
          if (doctor.rating >= range.min && doctor.rating < range.max) {
            distribution[range.label]++;
            break;
          } else if (range.max === 5.0 && doctor.rating === 5.0) {
            // Special case for exact 5.0 rating
            distribution[range.label]++;
            break;
          }
        }
      });
  
      return res.status(200).json({
        success: true,
        data: distribution
      });
  
    } catch (error) {
      console.error('Error getting doctor rating distribution:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve doctor rating distribution',
        error: error.message
      });
    }
  };

  export const getFeedbacksByRating = async (req, res) => {
  try {
    const { rating } = req.params;
    
    // Validate rating parameter
    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ 
        message: 'Invalid rating. Rating must be a number between 1 and 5.' 
      });
    }
    
    // Find all consultations with the specified rating
    const consultations = await Consultation.find(
      { 'feedback.rating': ratingValue },
      { 'feedback.comments': 1, _id: 0 }
    );
    
    // Extract comments from results
    const comments = consultations.map(consultation => consultation.feedback.comments);
    
    res.status(200).json({
      rating: ratingValue,
      totalComments: comments.length,
      comments
    });
  } catch (error) {
    console.error('Error in getFeedbacksByRating:', error);
    res.status(500).json({ message: 'Error retrieving feedback comments', error: error.message });
  }
};

export const getAllConsultations = async (req, res) => {
    try {
      // Find all consultations
      const consultations = await Consultation.find()
        .populate('patient_id', 'name email phone_number') // Populate basic patient info
        .populate('doctor_id', 'specialization qualification') // Populate basic doctor info
        .sort({ booked_date_time: -1 }); // Sort by booked date in descending order (newest first)
      
      if (!consultations || consultations.length === 0) {
        return res.status(200).json({ 
          message: 'No consultations found', 
          consultations: [] 
        });
      }
      
      res.status(200).json({
        totalConsultations: consultations.length,
        consultations
      });
    } catch (error) {
      console.error('Error in getAllConsultations:', error);
      res.status(500).json({ 
        message: 'Error retrieving consultations', 
        error: error.message 
      });
    }
  };


  // Function to retrieve data for the scatter plot
export const getDoctorQuadrantData = async(req, res) => {
    try {
      const {ratingThreshold, consultationThreshold} = req.body;
      
      const doctorData = await Consultation.aggregate([
        // Group consultations by doctor_id to count them
        { $group: { 
            _id: "$doctor_id", 
            consultationCount: { $sum: 1 } 
          } 
        },
        // Look up doctor information
        { $lookup: {
            from: "doctors",
            localField: "_id",
            foreignField: "_id",
            as: "doctorInfo"
          }
        },
        { $unwind: "$doctorInfo" },
        // Look up department information directly in the pipeline
        { $lookup: {
            from: "departments",
            localField: "doctorInfo.department_id",
            foreignField: "_id",
            as: "departmentInfo"
          }
        },
        { $unwind: { 
            path: "$departmentInfo",
            preserveNullAndEmptyArrays: true 
          }
        },
        // Project only the fields we need
        { $project: {
            doctorId: "$_id",
            doctorName: "$doctorInfo.name",
            department_id: "$doctorInfo.department_id",
            departmentName: { $ifNull: ["$departmentInfo.dept_name", "Unknown"] },
            rating: "$doctorInfo.rating",
            consultationCount: 1
          }
        }
      ]);
      
      // Categorize into quadrants - do this in memory since we already have all the data
      const quadrants = {
        highConsHighRating: [],
        highConsLowRating: [],
        lowConsHighRating: [],
        lowConsLowRating: []
      };
      
      doctorData.forEach(doctor => {
        const isHighRating = doctor.rating >= ratingThreshold;
        const isHighConsultation = doctor.consultationCount >= consultationThreshold;
        
        if (isHighRating && isHighConsultation) {
          quadrants.highConsHighRating.push(doctor);
        } else if (!isHighRating && isHighConsultation) {
          quadrants.highConsLowRating.push(doctor);
        } else if (isHighRating && !isHighConsultation) {
          quadrants.lowConsHighRating.push(doctor);
        } else {
          quadrants.lowConsLowRating.push(doctor);
        }
      });
      
      // Format for response
      const response = {
        highConsHighRating: quadrants.highConsHighRating.map(doc => ({
          DOCTOR: doc.doctorName,
          DEPARTMENT: doc.departmentName,
          RATING: doc.rating.toFixed(2),
          CONSULTATIONS: doc.consultationCount
        })),
        highConsLowRating: quadrants.highConsLowRating.map(doc => ({
          DOCTOR: doc.doctorName,
          DEPARTMENT: doc.departmentName,
          RATING: doc.rating.toFixed(2),
          CONSULTATIONS: doc.consultationCount
        })),
        lowConsHighRating: quadrants.lowConsHighRating.map(doc => ({
          DOCTOR: doc.doctorName,
          DEPARTMENT: doc.departmentName,
          RATING: doc.rating.toFixed(2),
          CONSULTATIONS: doc.consultationCount
        })),
        lowConsLowRating: quadrants.lowConsLowRating.map(doc => ({
          DOCTOR: doc.doctorName,
          DEPARTMENT: doc.departmentName,
          RATING: doc.rating.toFixed(2),
          CONSULTATIONS: doc.consultationCount
        })),
        counts: {
          highConsHighRating: quadrants.highConsHighRating.length,
          highConsLowRating: quadrants.highConsLowRating.length,
          lowConsHighRating: quadrants.lowConsHighRating.length,
          lowConsLowRating: quadrants.lowConsLowRating.length
        },
        graphData: doctorData.map(doc => ({
          doctorId: doc.doctorId,
          doctorName: doc.doctorName,
          department: doc.departmentName,
          rating: doc.rating,
          consultations: doc.consultationCount
        }))
      };
      
      // Send the response
      return res.status(200).json(response);
      
    } catch (error) {
      console.error("Error categorizing doctor data:", error);
      return res.status(500).json({ error: "Failed to retrieve doctor performance data" });
    }
  };

  // Function to categorize departments into quadrants based on thresholds
export const getDepartmentQuadrantData = async(req, res) => {
    try {
      const {ratingThreshold, consultationThreshold} = req.body;
      
      // Use aggregation pipeline to get department-level statistics
      const departmentData = await Consultation.aggregate([
        // Join with doctors collection to get doctor details
        { $lookup: {
            from: "doctors",
            localField: "doctor_id",
            foreignField: "_id",
            as: "doctorInfo"
          }
        },
        // Unwind the doctorInfo array
        { $unwind: "$doctorInfo" },
        
        // Join with departments collection to get department details
        { $lookup: {
            from: "departments",
            localField: "doctorInfo.department_id",
            foreignField: "_id",
            as: "departmentInfo"
          }
        },
        // Unwind the departmentInfo array
        { $unwind: { 
            path: "$departmentInfo",
            preserveNullAndEmptyArrays: true 
          }
        },
        
        // Group by department to get aggregated metrics
        { $group: {
            _id: "$departmentInfo._id",
            departmentName: { $first: "$departmentInfo.dept_name" },
            totalConsultations: { $sum: 1 },
            doctorIds: { $addToSet: "$doctorInfo._id" },
            // Collect all ratings to calculate average later
            ratings: { $push: "$doctorInfo.rating" }
          }
        },
        
        // Calculate averages and counts
        { $project: {
            _id: 0,
            departmentId: "$_id",
            departmentName: 1,
            totalConsultations: 1,
            doctorCount: { $size: "$doctorIds" },
            // Calculate average rating - using $avg directly might skew results if a doctor
            // has multiple consultations, so we collected unique doctor ratings above
            avgRating: { $avg: "$ratings" }
          }
        }
      ]);
      
      // Categorize into quadrants
      const quadrants = {
        highConsHighRating: [],
        highConsLowRating: [],
        lowConsHighRating: [],
        lowConsLowRating: []
      };
      
      departmentData.forEach(dept => {
        const isHighRating = dept.avgRating >= ratingThreshold;
        const isHighConsultation = dept.totalConsultations >= consultationThreshold;
        
        if (isHighRating && isHighConsultation) {
          quadrants.highConsHighRating.push(dept);
        } else if (!isHighRating && isHighConsultation) {
          quadrants.highConsLowRating.push(dept);
        } else if (isHighRating && !isHighConsultation) {
          quadrants.lowConsHighRating.push(dept);
        } else {
          quadrants.lowConsLowRating.push(dept);
        }
      });
      
      // Format for response - using the format from your second image
      const response = {
        highConsHighRating: {
          items: quadrants.highConsHighRating.map(dept => ({
            DEPARTMENT: dept.departmentName,
            AVG_RATING: dept.avgRating.toFixed(2),
            CONSULTATIONS: dept.totalConsultations,
            DOCTOR_COUNT: dept.doctorCount
          })),
          count: quadrants.highConsHighRating.length
        },
        highConsLowRating: {
          items: quadrants.highConsLowRating.map(dept => ({
            DEPARTMENT: dept.departmentName,
            AVG_RATING: dept.avgRating.toFixed(2),
            CONSULTATIONS: dept.totalConsultations,
            DOCTOR_COUNT: dept.doctorCount
          })),
          count: quadrants.highConsLowRating.length
        },
        lowConsHighRating: {
          items: quadrants.lowConsHighRating.map(dept => ({
            DEPARTMENT: dept.departmentName,
            AVG_RATING: dept.avgRating.toFixed(2),
            CONSULTATIONS: dept.totalConsultations,
            DOCTOR_COUNT: dept.doctorCount
          })),
          count: quadrants.lowConsHighRating.length
        },
        lowConsLowRating: {
          items: quadrants.lowConsLowRating.map(dept => ({
            DEPARTMENT: dept.departmentName,
            AVG_RATING: dept.avgRating.toFixed(2),
            CONSULTATIONS: dept.totalConsultations,
            DOCTOR_COUNT: dept.doctorCount
          })),
          count: quadrants.lowConsLowRating.length
        },
        // Graph data for scatter plot
        graphData: departmentData.map(dept => ({
          departmentId: dept.departmentId,
          departmentName: dept.departmentName,
          avgRating: dept.avgRating,
          consultations: dept.totalConsultations,
          doctorCount: dept.doctorCount
        }))
      };
      
      return res.status(200).json(response);
      
    } catch (error) {
      console.error("Error categorizing department data:", error);
      return res.status(500).json({ error: "Failed to retrieve department performance data" });
    }
  };

  // Function to get and print all doctors data
export const getAllDoctorsData = async (req, res) => {
    try {
      // Find all doctors in the collection
      const doctors = await Doctor.find({});
      
      // Return the doctors data
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
      
    } catch (error) {
      console.error("Error retrieving doctors data:", error);
      return res.status(500).json({
        success: false,
        error: "Server error while retrieving doctors data"
      });
    }
  };