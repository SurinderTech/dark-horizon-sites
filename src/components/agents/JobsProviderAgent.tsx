
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';

const JobsProviderAgent = ({ agent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchJobs = async () => {
    if (!searchQuery) {
      toast.error('Please enter a job title or keyword');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockJobs = [
        {
          id: 1,
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          salary: '$120k - $180k',
          type: 'Full-time',
          posted: '2 days ago',
          description: 'We are looking for a senior software engineer...'
        },
        {
          id: 2,
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          location: 'Remote',
          salary: '$80k - $120k',
          type: 'Full-time',
          posted: '1 day ago',
          description: 'Join our team as a frontend developer...'
        },
        {
          id: 3,
          title: 'Data Scientist',
          company: 'DataCorp',
          location: 'New York, NY',
          salary: '$100k - $150k',
          type: 'Full-time',
          posted: '3 days ago',
          description: 'Looking for a data scientist to join our analytics team...'
        }
      ];
      
      setJobs(mockJobs);
      toast.success(`Found ${mockJobs.length} job opportunities!`);
    } catch (error) {
      toast.error('Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Job Search</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Job Search Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="job-query">Job Title or Keywords</Label>
                  <Input
                    id="job-query"
                    placeholder="e.g., Software Engineer, Data Scientist"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="job-location">Location (Optional)</Label>
                  <Input
                    id="job-location"
                    placeholder="e.g., San Francisco, Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearchJobs} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Searching Jobs...' : 'Search Jobs'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{job.description}</p>
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
                <p className="text-muted-foreground">No jobs found. Try searching for positions!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobsProviderAgent;
