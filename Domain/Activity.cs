using System;

namespace Domain
{
    public class Activity : EntityBase<Activity>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime? Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }

        public override void CopyFrom(Activity activity)
        {
            this.Title = activity.Title ?? this.Title;
            this.Description = activity.Description ?? this.Description;
            this.Category = activity.Category ?? this.Category;
            this.Date = activity.Date ?? this.Date;
            this.City = activity.City ?? this.City;
            this.Venue = activity.Venue ?? this.Venue;
        }
    }
}
