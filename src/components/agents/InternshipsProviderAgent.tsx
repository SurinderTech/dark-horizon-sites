
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Calendar, MapPin, Building } from 'lucide-react';
import { toast } from 'sonner';

const InternshipsProviderAgent = ({ agent }) => {
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchInternships = async () => {
    if (!field) {
      toast.error('Please enter a field of study');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInternships = [
        {
          id: 1,
          title: 'Software Engineering Intern',
          company: 'Google',
          location: 'Mountain View, CA',
          duration: '3 months',
          stipend: '$8,000/month',
          deadline: '2024-03-15',
          description: 'Work on cutting-edge technologies...'
        },
        {
          id: 2,
          title: 'Data Science Intern',
          company: 'Meta',
          location: 'Menlo Park, CA',
          duration: '4 months',
          stipend: '$7,500/month',
          deadline: '2024-03-20',
          description: 'Join our data science team...'
        },
        {
          id: 3,
          title: 'UX Design Intern',
          company: 'Apple',
          location: 'Cupertino, CA',
          duration: '6 months',
          stipend: '$6,000/month',
          deadline: '2024-04-01',
          description: 'Design the future of user experiences...'
        }
      ];
      
      setInternships(mockInternships);
      toast.success(`Found ${mockInternships.length} internship opportunities!`);
    } catch (error) {
      toast.error('Failed to search internships');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Internships</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                Internship Finder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    placeholder="e.g., Computer Science, Marketing"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Preferred Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 3 months, Summer"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearchInternships} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Searching Internships...' : 'Find Internships'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {internships.length > 0 ? (
            <div className="space-y-4">
              {internships.map((internship) => (
                <Card key={internship.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{internship.title}</h3>
                        <p className="text-blue-600 font-medium">{internship.company}</p>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{internship.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{internship.stipend}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Deadline: {internship.deadline}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{internship.description}</p>
                      </div>
                      <div className="ml-4">
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No internships found. Try searching for opportunities!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternshipsProviderAgent;
