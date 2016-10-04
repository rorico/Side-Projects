// my first program in C++
#include <iterator>
#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>
using namespace std;

class CSVfile {
    private:
        string col,row;
        int numCol;
        int numRow;
        vector<vector<string> > info;
        vector<string> columnNames;
    public:
        CSVfile (string name){
            numCol = 0;
            numRow = 0;
            ifstream file(name.c_str());
            getline(file, col,'\n');
            istringstream col2(col);
            while (getline(col2, row,','))
            {
                ++numCol;
            }
            while(getline(file, col,'\n')){
                ++numRow;
            }
            vector<vector<string> > info(numRow, vector<string>(numCol));
            vector<string> columnNames(numCol);
            ifstream file2(name.c_str());
            int indexRow = 0;
            int indexCol = 0;
            getline(file2, col,'\n');
            istringstream col3(col);
            while (getline(col3, row,','))
            {
                columnNames[indexCol] = row;
                ++indexCol;
            }
            while(getline(file2, col,'\n')){
                indexCol = 0;
                istringstream col2(col);
                while (getline(col2, row,','))
                {
                    info[indexRow][indexCol] = row;
                    ++indexCol;
                }
                ++indexRow;
            }
            this->info = info;
            this->columnNames = columnNames;
        }
        int getIndex(string str){
            int index = 0;
            for( int i = 0 ; i < numCol ; ++i){
                if(columnNames[i]==str){
                    index = i;
                }
            }
            return index;
            
        }
        void showIndex(){
            for( int i = 0 ; i < numCol ; ++i){
                cout << columnNames[i] << endl;
            }
            
        }
        
    
};
static int getIndex(string array [], int size, string str){
    int index = 0;
    for( int i = 0 ; i < size ; ++i){
        if(array[i]==str){
            index = i;
        }
    }
    return index;
    
}
static void showIndex(string array [], int size){
    for( int i = 0 ; i < size ; ++i){
        cout << array[i] << endl;
    }
    
}
int main()
{
    CSVfile csv ("Day1.csv");
    csv.showIndex();
    
    /*ifstream file("Day1.csv");
    string col,row;
    string str,str2;
    int numCol = 0;
    int numRow = 0;
    getline(file, col,'\n');
    istringstream col2(col);
    while (getline(col2, row,','))
    {
        ++numCol;
    }
    while(getline(file, col,'\n')){
        ++numRow;
    }
    
    
    string info[numRow][numCol];
    string columnNames [numCol];
    ifstream file2("Day1.csv");
    int indexRow = 0;
    int indexCol = 0;
    getline(file2, col,'\n');
    istringstream col3(col);
    while (getline(col3, row,','))
    {
        columnNames[indexCol] = row;
        ++indexCol;
    }
    while(getline(file2, col,'\n')){
        indexCol = 0;
        istringstream col2(col);
        while (getline(col2, row,','))
        {
            info[indexRow][indexCol] = row;
            ++indexCol;
        }
        ++indexRow;
    }
    showIndex(columnNames,numCol);
    cout << getIndex(columnNames,numCol,"cameraStatus");
    cout << info[6720][5];*/
}