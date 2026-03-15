#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

// This is a C++ single line comment

/*
 * C++ Block comment
 * Defines a simple class for processing data points.
 */
class DataProcessor {
private:
    vector<int> dataPoints;
    string processorName;

public:
    // Constructor
    DataProcessor(string name) {
        processorName = name;
        cout << "Initialized processor: " << processorName << endl;
    }

    // Add a new point to the collection
    void addPoint(int value) {
        if (value >= 0) {
            dataPoints.push_back(value);
        } else {
            cerr << "Error: Cannot add negative values." << endl;
        }
    }

    // Calculate the average of all points
    double getAverage() {
        if (dataPoints.empty()) {
            return 0.0;
        }

        long long sum = 0;
        for (int i = 0; i < dataPoints.size(); i++) {
            sum += dataPoints[i];
        }

        return static_cast<double>(sum) / dataPoints.size();
    }
    
    // Process points with some complexity
    void filterAndSort() {
        vector<int> filtered;
        
        for (int val : dataPoints) {
            if (val % 2 == 0) {
                // Keep only even numbers
                filtered.push_back(val);
            }
        }
        
        sort(filtered.begin(), filtered.end());
        dataPoints = filtered;
    }
};

int main() {
    cout << "Starting C++ Data Analysis" << endl;
    
    DataProcessor dp("Main Analytics Engine");
    
    for (int i = 0; i < 15; i++) {
        if (i % 3 == 0) {
            dp.addPoint(i * 10);
        } else {
            dp.addPoint(i);
        }
    }
    
    cout << "Initial Average: " << dp.getAverage() << endl;
    
    dp.filterAndSort();
    
    cout << "Filtered Average: " << dp.getAverage() << endl;
    
    return 0;
}
